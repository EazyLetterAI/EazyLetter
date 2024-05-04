import {
  Document,
  Font,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { Delta } from "quill";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.ttf", fontWeight: 700, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-italic.ttf", fontWeight: 700, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Merriweather",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-normal.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-normal.ttf", fontWeight: 700, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-italic.ttf", fontWeight: 700, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Courier Prime",
  fonts: [
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/courier-prime@latest/latin-400-normal.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/courier-prime@latest/latin-700-normal.ttf", fontWeight: 700, fontStyle: "normal" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/courier-prime@latest/latin-400-italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "https://cdn.jsdelivr.net/fontsource/fonts/courier-prime@latest/latin-700-italic.ttf", fontWeight: 700, fontStyle: "italic" },
  ],
});

const fontFamily = {
  monospace: "Courier Prime",
  serif: "Merriweather",
  sans: "Roboto",
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 65,
    paddingHorizontal: 65,
    backgroundColor: "#ffffff",
    fontSize: 12,
  }
});

// Delta parsing related functions
const whitespacePrefix = <Text style={{ fontSize: 1, color: styles.page.backgroundColor }}>.</Text>;

const getLineNumberAlpha = (n: number) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  while (n >= 0) {
    result = alphabet.charAt(n % 26) + result;
    n = Math.floor(n / 26) - 1;
  }
  return result;
}

const getLineNumberRoman = (n: number) => {
  const roman = [{ m: 1000 }, { cm: 900 }, { d: 500 }, { cd: 400 }, { c: 100 }, { xc: 90 }, { l: 50 }, { xl: 40 }, { x: 10 }, { ix: 9 }, { v: 5 }, { iv: 4 }, { i: 1 }];
  let str = "";
  for (const i of roman) {
    while (n >= Object.values(i)[0]) {
      str += Object.keys(i)[0];
      n -= Object.values(i)[0];
    }
  }
  return str;
}

function processLink(link: string) {
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  } else {
    return "http://" + link;
  }
}

// This is the main function here which parses the Quill Delta object into a React PDF element
// The nested logic is quite convoluted but it is necessary to handle all the different cases succinctly
function parseDelta(delta: Delta | undefined, defaultStyle?: Style) {
  if (!delta) {
    return [];
  }

  const elements: React.JSX.Element[] = [];

  // This context is necessary for handling list items
  let listIndents: number[] = [];
  let listType = "";

  // Loop over each line
  delta.eachLine((line, attributes, idx) => {
    const lineElements: React.JSX.Element[] = [];

    let beginsWithWhitespace = false;

    // Loop over each part of the line
    line.ops?.forEach((op, i) => {
      let text = String(op.insert).replaceAll("\t", "    ");
      if (defaultStyle?.textTransform === "uppercase") {
        text = text.toUpperCase();
      } else if (defaultStyle?.textTransform === "lowercase") {
        text = text.toLowerCase();
      }

      if (i === 0 && text.trimStart().length != text.length) {
        beginsWithWhitespace = true;
      }

      const style: Style = {
        fontFamily: op.attributes?.font === "monospace" ? fontFamily.monospace : op.attributes?.font === "serif" ? fontFamily.serif : op.attributes?.font === "sans-serif" ? fontFamily.sans : defaultStyle?.fontFamily ?? fontFamily.sans,
        fontWeight: op.attributes?.bold ? "bold" : defaultStyle?.fontWeight ?? "normal",
        fontStyle: op.attributes?.italic ? "italic" : defaultStyle?.fontStyle ?? "normal",
        textDecoration: op.attributes?.underline ? (op.attributes?.strike ? "line-through underline" : "underline") : (op.attributes?.strike ? "line-through" : defaultStyle?.textDecoration ?? "none"),
        color: String(op.attributes?.color ?? defaultStyle?.color ?? "black"),
        backgroundColor: String(op.attributes?.background ?? defaultStyle?.backgroundColor ?? "transparent"),
      };

      // For handling links properly
      const linkStyle: Style = {
        color: String(op.attributes?.color ?? defaultStyle?.color ?? "blue"),
        backgroundColor: String(op.attributes?.background ?? defaultStyle?.backgroundColor ?? "transparent"),
      }

      lineElements.push(<Text key={i} style={style}>
        {op.attributes?.link ? <Link src={processLink(String(op.attributes.link))} style={linkStyle}>{text}</Link> : text}
      </Text>);
    });

    // Deal with indents and lists
    let indent = 36 * Number(attributes.indent ?? 0);
    let listPrefix = "";

    if (!attributes?.list || listType !== attributes.list) {
      listIndents = [];
    }

    if (attributes?.list) {
      indent += 18;
      listType = String(attributes.list);
      const lineIndent = Number(attributes.indent ?? 0);  // The indent starts at 0
      if (listIndents.length <= lineIndent) {
        listIndents.push(0);
      } else if (listIndents.length > lineIndent + 1) {
        listIndents = listIndents.slice(0, lineIndent + 1);
      }
      listIndents[lineIndent]++;
      if (listType === "ordered") {
        if (lineIndent % 3 === 0) {
          listPrefix = (listIndents[lineIndent] ?? 0).toString() + ". ";
        } else if (lineIndent % 3 === 1) {
          listPrefix = getLineNumberAlpha((listIndents[lineIndent] ?? 0) - 1) + ". ";
        } else if (lineIndent % 3 === 2) {
          listPrefix = getLineNumberRoman(listIndents[lineIndent] ?? 0) + ". ";
        }
      } else if (listType === "bullet") {
        listPrefix = "• ";
      }
    }

    // For some reason, white space at the beginning of a line is not fully rendered
    if (beginsWithWhitespace) {
      lineElements.unshift(whitespacePrefix);
    }

    const style: Style = {
      fontSize: attributes.header ? [8, 10, 12, 14, 18, 24][6 - Number(attributes.header)] : defaultStyle?.fontSize ?? 12,
      textAlign: attributes.align === "justify" ? "justify" : attributes.align === "center" ? "center" : attributes.align === "right" ? "right" : defaultStyle?.textAlign ?? "left",
      paddingLeft: indent,
    };

    elements.push(<Text key={idx} style={style}><Text>{listPrefix}</Text>{lineElements.length ? lineElements : "\n"}</Text>);
  });

  return elements;
}

function Divider(props: { space?: number }) {
  return <View style={{ borderBottom: 1, borderColor: "black", marginVertical: props.space ?? 8 }} />;
}

// The default cover letter template
export function CoverLetter(props: {
  letterContents?: Delta | string;
  name?: Delta | string;
  email?: Delta | string;
  phone?: Delta | string;
}) {
  const output = (contents?: Delta | string) => {
    if (typeof contents === "string") {
      return <Text>{contents}</Text>;
    } else {
      return parseDelta(contents);
    }
  };

  return (
    <Document>
      <Page wrap style={styles.page}>
        <View>
          {output(props.letterContents)}
        </View>
        <View style={{ position: "absolute", top: 10, right: 10 }}>
          <Text style={{ textAlign: "left" }}>{output(props.name)}</Text>
          <Text style={{ textAlign: "left" }}>{output(props.email)}</Text>
          <Text style={{ textAlign: "left" }}>{output(props.phone)}</Text>
        </View>
      </Page>
    </Document>
  );
}

// Note that these templates are designed to take in either Quill Delta objects or plain strings,
// for versatility and for easy use of default values
export type ResumeInfo = {
  name: Delta | string;
  email?: Delta | string | null;
  phone?: Delta | string | null;
  address?: Delta | string | null;
  objective?: Delta | string | null;
  experiences: {
    type: string;  // For templates that distinguish between different types of experiences
    title?: Delta | string | null;
    subtitle?: Delta | string | null;
    location?: Delta | string | null;
    startDate: Delta | string;
    endDate?: Delta | string | null;
    link?: string | null;
    description?: Delta | string | null;
  }[];
  education: {
    schoolName: Delta | string;
    location?: Delta | string | null;
    startDate: Delta | string;
    endDate?: Delta | string | null;
    details?: Delta | string | null;
  }[];
  links: {
    display?: Delta | string | null;
    link: string | null;
  }[];
  skills?: Delta | string | null;
};

// The default resume template
export function Resume(props: {
  info: ResumeInfo;
}) {
  const text = { fontFamily: fontFamily.serif, fontSize: 12 };

  const output = (contents?: Delta | string | null, defaultStyle?: Style) => {
    if (typeof contents === "string") {
      return <Text style={defaultStyle}>{contents}</Text>;
    } else if (contents) {
      return parseDelta(contents, { ...text, ...defaultStyle });
    }
  };

  // This is a helper function to see if a string or Delta is empty
  const empty = (contents?: Delta | string | null) => {
    if (typeof contents === "string") {
      return contents.length === 0;
    } else {
      return contents?.ops?.map((op) => String(op?.insert).trim().length).reduce((a, b) => a + b, 0) === 0;
    }
  }

  return (
    <Document>
      <Page wrap style={styles.page}>
        <View>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontFamily: fontFamily.serif, fontSize: 18 }}>{output(props.info.name)}</Text>
          {(!empty(props.info.address) || !empty(props.info.phone) || !empty(props.info.email) || props.info.links.length) && <>
            <Divider />
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
              {!empty(props.info.address) && <Text>{output(props.info.address)}</Text>}
              {!empty(props.info.phone) && <Text>{output(props.info.phone)}</Text>}
              {!empty(props.info.email) && <Text>{output(props.info.email)}</Text>}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 12 }}>
              {props.info.links.map((link, i) => (
                !empty(link.link) && <Link key={i} href={processLink(link.link!)}>{output(!empty(link.display) ? link.display : link.link)}</Link>
              ))}
            </View>
          </>}
          {!empty(props.info.objective) && (
            <View>
              <Divider />
              <View style={{ alignItems: "center" }}>{output(props.info.objective)}</View>
            </View>
          )}
          {props.info.experiences.length && (
            <View style={{ marginVertical: 6 }}>
              <Text style={{ fontWeight: "bold", fontFamily: fontFamily.serif, fontSize: 14 }}>EXPERIENCE</Text>
              <Divider space={0} />
              <View style={{ marginTop: 6, gap: 12 }}>
                {props.info.experiences.map((exp, i) => (
                  !empty(exp.title) && <View key={i}>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flexGrow: 1 }}>
                        <Text>
                          {exp.link ? <Link src={exp.link}>{output(exp.title, { fontWeight: "bold", textTransform: "uppercase" })}</Link> : output(exp.title, { fontWeight: "bold", textTransform: "uppercase" })}
                        </Text>
                        <Text>{output(exp.subtitle)}</Text>
                      </View>
                      <View>
                        <Text style={{ ...text, alignSelf: "flex-end" }}>{output(exp.location)}</Text>
                        {!empty(exp.startDate) && <Text style={{ ...text, fontStyle: "italic", alignSelf: "flex-end" }}>
                          {output(exp.startDate, { fontStyle: "italic" })}-{output(!empty(exp.endDate) ? exp.endDate : "Present", { fontStyle: "italic" })}
                        </Text>}
                      </View>
                    </View>
                    <View style={{ marginTop: 5 }}>{output(exp.description)}</View>
                  </View>
                ))}
              </View>
            </View>
          )}
          {props.info.education.length && (
            <View style={{ marginVertical: 6 }}>
              <Text style={{ fontWeight: "bold", fontFamily: fontFamily.serif, fontSize: 14 }}>EDUCATION</Text>
              <Divider space={0} />
              <View style={{ marginTop: 6, gap: 12 }}>
                {props.info.education.map((edu, i) => (
                  <View key={i} style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                      {output(edu.schoolName, { fontWeight: "bold", textTransform: "uppercase" })}
                      {output(edu.details)}
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={{ ...text, alignSelf: "flex-end" }}>{output(edu.location)}</Text>
                      {!empty(edu.startDate) && <Text style={{ ...text, fontStyle: "italic", alignSelf: "flex-end" }}>
                        {output(edu.startDate, { fontStyle: "italic" })}-{output(!empty(edu.endDate) ? edu.endDate : "Present", { fontStyle: "italic" })}
                      </Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          {!empty(props.info.skills) && (
            <View style={{ marginVertical: 6 }}>
              <Text style={{ fontWeight: "bold", fontFamily: fontFamily.serif, fontSize: 14 }}>SKILLS</Text>
              <Divider space={0} />
              <View style={{ marginTop: 6 }}>{output(props.info.skills)}</View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
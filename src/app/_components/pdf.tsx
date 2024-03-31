import {
  Document,
  Font,
  Page,
  Text,
  View,
  StyleSheet,
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

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  main: {
    marginVertical: 65,
    marginHorizontal: 65,
    flexGrow: 1,
    fontSize: 12,
  },
  contactInfo: {
    top: 10,
    right: 10,
    textAlign: "right",
  }
});

const whitespacePrefix = <Text style={{fontSize: 1, color: styles.page.backgroundColor}}>.</Text>

function parseDelta(delta: Delta | undefined) {
  if (!delta) {
    return [];
  }

  const elements: React.JSX.Element[] = [];

  // This context is necessary for handling list items
  const listIndents = [];
  const ordered = false;

  // Loop over each line
  delta.eachLine((line, attributes, idx) => {
    const lineElements: React.JSX.Element[] = [];

    let beginsWithWhitespace = false;

    // Loop over each part of the line
    line.ops?.forEach((op, i) => {
      const text = String(op.insert).replaceAll("\t", "    ");

      if (i === 0 && text.trimStart().length != text.length) {
        beginsWithWhitespace = true;
      }

      const style: Style = {
        fontFamily: op.attributes?.font === "monospace" ? "Courier Prime" : op.attributes?.font === "serif" ? "Merriweather" : "Roboto",
        fontWeight: op.attributes?.bold ? "bold" : "normal",
        fontStyle: op.attributes?.italic ? "italic" : "normal",
        textDecoration: op.attributes?.underline ? (op.attributes?.strike ? "line-through underline" : "underline") : (op.attributes?.strike ? "line-through" : "none"),
        color: String(op.attributes?.color),
        backgroundColor: String(op.attributes?.background || "transparent"),
      };
      
      lineElements.push(<Text key={i} style={style}>{text}</Text>);
    });

    // Deal with indents and lists
    if (attributes?.list) {

    } else if (attributes?.indent) {
      
    }

    // For some reason, white space at the beginning of a line is not fully rendered
    if (beginsWithWhitespace) {
      lineElements.unshift(whitespacePrefix);
    }

    const style: Style = {
      fontSize: [8, 10, 12, 14, 18, 24][6 - Number(attributes.header) || 2],
      textAlign: attributes.align === "justify" ? "justify" : attributes.align === "center" ? "center" : attributes.align === "right" ? "right" : "left",
    };

    elements.push(<Text key={idx} style={style}>{lineElements.length ? lineElements : "\n"}</Text>);
  });

  return elements;
}

export function CoverLetter(props: {
  letterContents: Delta | string | undefined;
  name: Delta | string | undefined;
  email: Delta | string | undefined;
  phone: Delta | string | undefined;
}) {
  const output = (contents: Delta | string | undefined) => {
    if (typeof contents === "string") {
      return <Text>{contents}</Text>;
    } else {
      return parseDelta(contents);
    }
  };

  return (
    <Document>
      <Page wrap style={styles.page}>
        <View style={styles.main}>
          {output(props.letterContents)}
        </View>
        <View style={styles.contactInfo}>
          {output(props.name)}
          {output(props.email)}
          {output(props.phone)}
        </View>
      </Page>
    </Document>
  );
}

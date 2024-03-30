import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Delta } from "quill";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  section: {
    marginVertical: 65,
    marginHorizontal: 65,
    flexGrow: 1,
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
});

function parseDelta(delta: Delta) {
  console.log(delta);
  if (!delta) {
    return;
  }

  const elements = [];

  delta.eachLine((line, attributes) => {
    const lineElements = [];
    line.forEach((op) => {
      lineElements.push(<Text>{op.insert}</Text>);
    });
    elements.push(<View>{lineElements}</View>);
  });

  console.log(elements);

  return elements;
}

export function CoverLetter(props: {letterContents: Delta}) {
  return (
    <Document>
      <Page wrap style={styles.page}>
        <View style={styles.section}>
          {parseDelta(props.letterContents)}
        </View>
      </Page>
    </Document>
  );
}

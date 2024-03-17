import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    fontSize: 12,
  },
});

export async function GenerateCoverLetter(letterContents: string) {
  const CoverLetter = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{letterContents}</Text>
        </View>
      </Page>
    </Document>
  );

  const stream = await ReactPDF.renderToStream(<CoverLetter />);
  return new Promise<Buffer>(function(resolve, reject) {
    const buffers: Buffer[] = []
    stream.on('data', (data: Buffer) => {
      buffers.push(data)
    })
    stream.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
    stream.on('error', reject)
  })
}
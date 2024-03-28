import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';


interface PDFPropsVentas {
  data: Report[];
  inicio: string;
  final: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    fontSize: 10,
    borderLeftWidth: 0,
    textAlign: 'center',
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    textAlign: 'center',
  },
  fecha: {
    margin: '10px 0',
    fontSize: 10,
  }
});
const formatFecha = (fecha: any) => {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const formatFecha2 = (fecha: any) => {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
  };

const PDFPeriodo = ({ data, inicio, final }: PDFPropsVentas) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Ventas</Text>
      <Text style={styles.fecha}>Reporte desde {formatFecha2(inicio)} hasta {formatFecha2(final)}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>No. Factura</Text>
          <Text style={styles.tableCol}>Cliente</Text>
          <Text style={styles.tableCol}>Fecha y Hora</Text>
          <Text style={styles.tableCol}>Productos Vendidos</Text>
          <Text style={styles.tableCol}>Total</Text>
        </View>
        {data.map((reporte:any) => (
          <View style={styles.tableRow} key={reporte.id}>
            <Text style={styles.tableCol}>{reporte.numFactura}</Text>
            <Text style={styles.tableCol}>{reporte.cliente}</Text>
            <Text style={styles.tableCol}>{formatFecha(reporte.fecha)}</Text>
            <Text style={styles.tableCol}>{reporte.productosVendidos}</Text>
            <Text style={styles.tableCol}>L.{reporte.total}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFPeriodo;

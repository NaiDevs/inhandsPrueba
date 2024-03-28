import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';


interface PDFPropsRentabilidad {
  data: Report[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 15,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000', // Color del borde
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    padding: 5,
    width: '18%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000', // Color del borde
    textAlign: 'center',
    fontSize: 11
  },
});

const formatNumber = (number:any) => {
  return Number(number).toFixed(2);
};

const PDFRentabilidad = ({ data }: PDFPropsRentabilidad) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Rentabilidad de Productos</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Codigo</Text>
          <Text style={styles.tableCol}>Nombre</Text>
          <Text style={styles.tableCol}>Costo de Compra</Text>
          <Text style={styles.tableCol}>Precio de Venta</Text>
          <Text style={styles.tableCol}>Unidades Vendidas</Text>
          <Text style={styles.tableCol}>Ingresos de Ventas</Text>
          <Text style={styles.tableCol}>Costos Totales</Text>
          <Text style={styles.tableCol}>Margen de Ganancia</Text>
          <Text style={styles.tableCol}>Ganancia por Unidad</Text>
        </View>
        {data.map((reporte:any) => (
          <View style={styles.tableRow} key={reporte.codigo}>
            <Text style={styles.tableCol}>{reporte.codigo}</Text>
            <Text style={styles.tableCol}>{reporte.nombre}</Text>
            <Text style={styles.tableCol}>L.{reporte.costoCompra}</Text>
            <Text style={styles.tableCol}>L.{reporte.precio}</Text>
            <Text style={styles.tableCol}>{reporte.unidadesVendidas}</Text>
            <Text style={styles.tableCol}>L.{reporte.ingresosVentas}</Text>
            <Text style={styles.tableCol}>L.{reporte.costosTotales}</Text>
            <Text style={styles.tableCol}>L.{reporte.margenGanancia}</Text>
            <Text style={styles.tableCol}>L.{reporte.gananciaUnidad}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFRentabilidad;

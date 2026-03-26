import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const EMOJIS = {
  Feliz: "😊",
  Cansada: "😴",
  Ansiosa: "😰",
  Náuseas: "🤢",
  Triste: "😢",
  Tranquila: "😌",
  Emocionada: "🥰",
  Irritable: "😤",
};

export default function DetalleRegistroScreen({ navigation, route }) {
  const { registro } = route.params;

  const semanasPorcentaje = (registro.semana_embarazo / 42) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FormularioRegistro", { registro })
          }
        >
          <Text style={styles.editar}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.semana}>
          Semana {registro.semana_embarazo} de 42
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${semanasPorcentaje}%` }]}
          />
        </View>
        <Text style={styles.porcentaje}>
          {Math.round(semanasPorcentaje)}% del embarazo
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Fecha</Text>
        <Text style={styles.cardValue}>{registro.fecha}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estado de ánimo</Text>
        <Text style={styles.estadoAnimo}>
          {EMOJIS[registro.estado_animo] || "😐"}{" "}
          {registro.estado_animo || "No registrado"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤒 Síntomas</Text>
        <Text style={styles.cardValue}>
          {registro.sintomas || "Ninguno registrado"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📝 Notas</Text>
        <Text style={styles.cardValue}>
          {registro.notas || "Sin notas adicionales"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
  },
  back: { fontSize: 16, color: "#e91e8c", fontWeight: "bold" },
  editar: { fontSize: 16, color: "#e91e8c", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    margin: 12,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  semana: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#c2185b",
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#fce4ec",
    borderRadius: 6,
    marginBottom: 6,
  },
  progressFill: { height: 12, backgroundColor: "#e91e8c", borderRadius: 6 },
  porcentaje: { fontSize: 13, color: "#888", textAlign: "right" },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 8,
  },
  cardValue: { fontSize: 16, color: "#333", lineHeight: 24 },
  estadoAnimo: { fontSize: 22, color: "#333" },
});

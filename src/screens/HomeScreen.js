import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../supabase";

export default function HomeScreen({ navigation }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistros();
    const unsubscribe = navigation.addListener("focus", fetchRegistros);
    return unsubscribe;
  }, [navigation]);

  const fetchRegistros = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registros")
      .select("*")
      .order("fecha", { ascending: false });
    if (error) {
      Alert.alert("Error", "No se pudieron cargar los registros");
    } else {
      setRegistros(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Eliminar",
      "¿Estás segura de que deseas eliminar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("registros")
              .delete()
              .eq("id", id);
            if (error) {
              Alert.alert("Error", "No se pudo eliminar el registro");
            } else {
              fetchRegistros();
            }
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const semanaActual =
    registros.length > 0
      ? Math.max(...registros.map((r) => r.semana_embarazo))
      : 0;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalleRegistro", { registro: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardSemana}>Semana {item.semana_embarazo}</Text>
        <Text style={styles.cardFecha}>{item.fecha}</Text>
      </View>
      <Text style={styles.cardAnimo}>
        {EMOJIS[item.estado_animo] || "😐"}{" "}
        {item.estado_animo || "No registrado"}
      </Text>
      <Text style={styles.cardSintomas} numberOfLines={2}>
        🤒 {item.sintomas || "Sin síntomas registrados"}
      </Text>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("FormularioRegistro", { registro: item })
          }
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🤰 Mis Registros</Text>
          {semanaActual > 0 && (
            <Text style={styles.semanaActual}>
              Semana actual: {semanaActual}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {semanaActual > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(semanaActual / 42) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Semana {semanaActual} de 42 —{" "}
            {Math.round((semanaActual / 42) * 100)}%
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e91e8c"
          style={{ marginTop: 40 }}
        />
      ) : registros.length === 0 ? (
        <Text style={styles.empty}>
          No tienes registros aún. ¡Agrega el primero!
        </Text>
      ) : (
        <FlatList
          data={registros}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("FormularioRegistro", { registro: null })
        }
      >
        <Text style={styles.fabText}>+ Nuevo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#e91e8c",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  semanaActual: { fontSize: 13, color: "#fce4ec", marginTop: 2 },
  logout: { color: "#fff", fontSize: 14 },
  progressContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    elevation: 2,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#fce4ec",
    borderRadius: 6,
    marginBottom: 6,
  },
  progressFill: { height: 12, backgroundColor: "#e91e8c", borderRadius: 6 },
  progressText: { fontSize: 13, color: "#888", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    margin: 12,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardSemana: { fontWeight: "bold", fontSize: 16, color: "#c2185b" },
  cardFecha: { color: "#888", fontSize: 14 },
  cardAnimo: { fontSize: 16, color: "#555", marginBottom: 4 },
  cardSintomas: { fontSize: 14, color: "#555", marginBottom: 12 },
  cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  editButton: { backgroundColor: "#f48fb1", padding: 8, borderRadius: 8 },
  editButtonText: { color: "#fff", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#ef9a9a", padding: 8, borderRadius: 8 },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 60, fontSize: 16, color: "#aaa" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#e91e8c",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 5,
  },
  fabText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

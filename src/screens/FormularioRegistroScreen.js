import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../supabase";

const ESTADOS_ANIMO = [
  { emoji: "😊", label: "Feliz" },
  { emoji: "😴", label: "Cansada" },
  { emoji: "😰", label: "Ansiosa" },
  { emoji: "🤢", label: "Náuseas" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😌", label: "Tranquila" },
  { emoji: "🥰", label: "Emocionada" },
  { emoji: "😤", label: "Irritable" },
];

export default function FormularioRegistroScreen({ navigation, route }) {
  const registro = route.params?.registro;
  const esEdicion = !!registro;

  const [fecha, setFecha] = useState(
    registro?.fecha ? new Date(registro.fecha) : new Date(),
  );
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [semana, setSemana] = useState(
    registro?.semana_embarazo?.toString() || "",
  );
  const [sintomas, setSintomas] = useState(registro?.sintomas || "");
  const [estadoAnimo, setEstadoAnimo] = useState(registro?.estado_animo || "");
  const [notas, setNotas] = useState(registro?.notas || "");
  const [loading, setLoading] = useState(false);

  const fechaFormateada = fecha.toISOString().split("T")[0];

  const validar = () => {
    if (!semana) {
      Alert.alert("Error", "La semana de embarazo es obligatoria");
      return false;
    }
    const semanaNum = parseInt(semana);
    if (isNaN(semanaNum) || semanaNum < 1 || semanaNum > 42) {
      Alert.alert("Error", "La semana debe ser un número entre 1 y 42");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const datos = {
      fecha: fechaFormateada,
      semana_embarazo: parseInt(semana),
      sintomas,
      estado_animo: estadoAnimo,
      notas,
      user_id: user.id,
    };

    let error;
    if (esEdicion) {
      ({ error } = await supabase
        .from("registros")
        .update(datos)
        .eq("id", registro.id));
    } else {
      ({ error } = await supabase.from("registros").insert(datos));
    }

    setLoading(false);
    if (error) {
      Alert.alert("Error", "No se pudo guardar el registro");
    } else {
      Alert.alert(
        "Éxito",
        esEdicion ? "Registro actualizado" : "Registro creado",
      );
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {esEdicion ? "Editar Registro" : "Nuevo Registro"}
      </Text>

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarPicker(true)}
      >
        <Text style={styles.dateButtonText}>📅 {fechaFormateada}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={fecha}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              if (selectedDate) setFecha(selectedDate);
              if (Platform.OS === "android") setMostrarPicker(false);
            }}
            themeVariant="light"
            textColor="#000000"
            accentColor="#e91e8c"
          />
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.pickerDone}
              onPress={() => setMostrarPicker(false)}
            >
              <Text style={styles.pickerDoneText}>Listo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.label}>Semana de embarazo (1-42) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 20"
        value={semana}
        onChangeText={setSemana}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Estado de ánimo</Text>
      <View style={styles.emojiContainer}>
        {ESTADOS_ANIMO.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.emojiButton,
              estadoAnimo === item.label && styles.emojiSelected,
            ]}
            onPress={() => setEstadoAnimo(item.label)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.emojiLabel,
                estadoAnimo === item.label && styles.emojiLabelSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Síntomas</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Ej: Náuseas, dolor de espalda..."
        value={sintomas}
        onChangeText={setSintomas}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Notas adicionales</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Escribe cualquier observación..."
        value={notas}
        onChangeText={setNotas}
        multiline
        numberOfLines={4}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e91e8c"
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <Text style={styles.buttonText}>
            {esEdicion ? "Actualizar" : "Guardar"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonOutlineText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6", padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#c2185b",
    marginBottom: 24,
    marginTop: 40,
  },
  label: { fontSize: 14, fontWeight: "bold", color: "#555", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f48fb1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multiline: { height: 90, textAlignVertical: "top" },
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f48fb1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  dateButtonText: { fontSize: 16, color: "#333" },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f48fb1",
    overflow: "hidden",
  },
  pickerDone: { backgroundColor: "#e91e8c", padding: 12, alignItems: "center" },
  pickerDoneText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  emojiButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f48fb1",
    backgroundColor: "#fff",
    width: "22%",
  },
  emojiSelected: { backgroundColor: "#e91e8c", borderColor: "#e91e8c" },
  emoji: { fontSize: 24 },
  emojiLabel: { fontSize: 11, color: "#555", marginTop: 2 },
  emojiLabelSelected: { color: "#fff" },
  button: {
    backgroundColor: "#e91e8c",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#e91e8c",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonOutlineText: { color: "#e91e8c", fontWeight: "bold", fontSize: 16 },
});

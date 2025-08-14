import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
  },

  // <— FALTA EN TU ARCHIVO
  header: {
    height: 180,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backButton: {
    position: "absolute",
    top: 24,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  // <— FALTA EN TU ARCHIVO
  cardWrapper: {
    flex: 1,
    marginTop: -60, // superpone la tarjeta sobre el header
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#284B8F",
    textAlign: "center",
    marginBottom: 14,
  },

  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inlineText: {
    color: "#6B7280",
    fontSize: 14,
    marginLeft: 8,
  },
  linkInline: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#3465EB",
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#3465EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#a5a5a5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    ...(Platform.OS === "web" ? { gap: 14 as any } : {}),
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  footerRow: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  footerLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});

export default styles;
import { StyleSheet } from "react-native";

export const COLORS = {
  darkestBlue: '#2C3E91',
  darkBlue: '#5E78F7',
  mediumBlue: '#8DB3FF',
  lightestBlue: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightestBlue,
  },
  header: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shapeOne: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    left: -50,
  },
  shapeTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: 50,
    right: 20,
  },
  shapeThree: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 20,
    left: 80,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.lightestBlue,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cardWrapper: {
    flex: 1,
    marginTop: 150,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.lightestBlue,
    borderRadius: 20,
    padding: 30,
    shadowColor: COLORS.darkestBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.darkBlue,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: COLORS.lightestBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },
});

export default styles;
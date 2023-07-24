import { StyleSheet } from "react-native";
import { theme } from "../../../App.style";

export const homeStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  subModalContainer:{
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20
  },
  modalTitle: {
    textAlign: 'center', 
    fontSize: 18, 
    marginBottom: 20 
  },
  modalInput: {
    borderWidth: 1, 
    borderColor: 'gray', 
    borderRadius: 5, 
    padding: 10,
    marginBottom: 10
  },
  modalButton: {
    backgroundColor: '#0079C2', 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 10
  },
  modalButtonText: {
    color: "#0079C2", 
    textAlign: 'center'
  },
  hintText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hintSelectedText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  pointsContainer: {
    position: 'absolute',
    top: 90,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  listPoints: {
    marginRight: 10,
  },
  
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary
  },
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    marginTop: -50
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    maxWidth: 300,
    minWidth: 200,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: 'white', 
    marginBottom: 10,
    paddingVertical: 5,
  },  
  buttonCancel: {
    borderWidth: 1, 
    borderColor: '#0079C2', 
    borderRadius: 5, 
    padding: 10,
  },    
  hintContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  
})
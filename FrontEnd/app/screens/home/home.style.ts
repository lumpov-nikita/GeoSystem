import { StyleSheet } from "react-native";
import { theme } from "../../../App.style";

export const homeStyle = StyleSheet.create({
  hintText: {
    color: 'white',
    fontSize: 16,
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
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
    button: {
      backgroundColor: 'transparent',
      maxWidth: 300,
      width: '80%',
      alignSelf: 'center',
      borderRadius: 10,
      borderWidth: 1, 
      borderColor: 'white', 
      marginBottom: 10,
      paddingVertical: 5,
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
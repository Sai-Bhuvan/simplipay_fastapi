import { StyleSheet } from 'react-native';

export default StyleSheet.create({

  screen: {
    flex: 1,
    justifyContent: "center"
  },

  container: {
    paddingTop: 15,
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: '#238',
    borderWidth: 2,    
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf:'center',
    elevation: 5,               
  },


  inputLabel: {
    fontSize: 20,
    fontWeight: 300,
  },

  input: {
    margin: 10,  
    borderWidth: 2,
    
  },

  touchableComp: {
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "300",
    paddingStart: 15,
    textAlign: 'center',
    
  },

  subHeaderText: {
    flex: 1,
    textAlign: "center", 
    fontSize: 30,   
  },

  button: {
    backgroundColor: '#238',     
    paddingVertical: 12,         
    paddingHorizontal: 20,      
    borderRadius: 8,             
    alignItems: 'center',        
    justifyContent: 'center',    
    alignSelf: 'center',         
    marginTop: 20,               
    width: 100,
    elevation: 3,                
    shadowColor: '#000',         
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  

  headerText: {    
    textAlign: "center",
    fontSize: 50,
    paddingTop: 40,    
    marginTop: 20,
    paddingBottom: 30,
  }


});
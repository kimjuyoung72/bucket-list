import React from "react";
import styled from "styled-components/native";
import { Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// import { PlatformColor, useWindowDimensions } from 'react-native';
import reactDom from "react-dom";

// const StyledInput = styled.TextInput.attrs(
//     ({placeholder}) =>
//     ({

//         placeholderTextColor : 'orange'
//     })
    
// )`
//     width: ${({width})=>width - 40}px;
//     /* height: 60px; */
//     margin: 3px 0;
//     padding: 15px 20px;
//     border-radius: 10px;
//     background-color: ${({theme})=>theme.itemBackground};
//     font-size: 25px;
//     color: ${({theme})=>theme.text};
// `;
const StyledTouch = styled.TouchableOpacity`
        color: #fff;
      background-color: ${({theme})=>theme.itemBackground};
`;
const DeleteButton = (props) => {
    const width = Dimensions.get('window').width;
    // const width = useWindowDimensions().width;
    return (<StyledTouch 
                width={width} 
                // onPressOut={}
                title={props.title}
                />);
}
DeleteButton.defaultProps = {
    // value: 'lorem'
}
DeleteButton.propTypes = {
    // placeholder: PropTypes.string.isRequired,
    // value: PropTypes.string,
    // onChangeText: PropTypes.func.isRequired,
    // onSubmitEditing: PropTypes.func.isRequired,
    // onBlur: PropTypes.func.isRequired
};
export default DeleteButton;

// const styles = StyleSheet.create({
//   container: {
//     flex: 0.1,
//     justifyContent: "center",
//     paddingHorizontal: 10
//   },
//   button: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: "center",
//     width: width - 40,
//     backgroundColor: 'orange',
//     padding: 10,
//     fontSize: 24,
//     fontWeight: 'bold',
//     borderRadius: 5,
//   },
// });
import React,{useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import theme from './theme';
import { StatusBar } from 'react-native';
import Input from './components/Input';
import Task from './components/Task';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { View } from 'react-native-web';
// import DeleteButton from './components/DeleteButton';


const width = Dimensions.get('window').width;
const Container = styled.View`
  flex:1;
  background-color: ${({theme}) => theme.background};
  
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({theme})=>theme.main};
  align-self: flex-start;
  margin:0 20px;
  `;

const List = styled.ScrollView`
  flex:1;
  width:${({width})=> width - 40}px;
  `;


export default function App() {
  
  const [isReady, setIsReady] = useState(true);  //앱 실행준비 상태
  const [newTask, setNewTask ] = useState('');    //새로운 항목
  const [tasks, setTasks] = useState({});         //항목 리스트

  //로컬저장소에 데이터 저장하기
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      setTasks(value);
    } catch (e) {
      // saving error
    }
  }
  
  //로컬저장소에 데이터 가져오하기
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(jsonValue);
      const tasks = jsonValue != null ? JSON.parse(jsonValue) : {};
      setTasks(tasks);
    } catch(e) {
      console.log('데이터 가져오기:'+jsonValue);
    }
  }

  //로컬저장소 삭제 by key
  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      // remove error
    }
      
    console.log('항목삭제:'+key);
  }

  
  //추가
  const _addTask = ()=>{
    console.log('입력완료');
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]:{id:ID, text:newTask, completed:false}
    };
    
    //setTasks({...tasks, ...newTaskObject}); //객체 병합 by 스프레드문법
    storeData('tasks', {...tasks, ...newTaskObject});  //로컬저장소에 저장
    setNewTask('');
  };
  
  const _handleTextChange = text=>{
    setNewTask(text);
  };
  
  //삭제
  const _deleteTask = (id)=>{
    const currentTasks = {...tasks};  //객체복사
    delete currentTasks[id];
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  };
  
  //전체 삭제
  const _clearAll = async () => {
    const currentTasks = {...tasks} || null;

    console.log(currentTasks);
    for (let id in currentTasks) {
      if (currentTasks[id].completed) {

        delete currentTasks[id];
      }
    }
    console.log(currentTasks);
    
    try {
      await AsyncStorage.clear()
      
    } catch(e) {
      // clear error
    }

    storeData('tasks', currentTasks);
    console.log('전체 삭제 Done.')
  }

  const DeleteAllButton = ({Content}) => {

    return (

      <View style={styles.container}>
        
        <TouchableOpacity
          style={styles.button}
          onPress={_clearAll}
        >
          <Text>{Content}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  //완료
  const _toggleTask = id => {
    const currentTasks = {...tasks};  //객체 복사
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  }

  //수정
  const _updateTask = task => {
    const currentTasks = {...tasks};   //객체 복사
    currentTasks[task.id] = task;      //수정 항목
    //setTasks(currentTasks); //tasks = currentTasks;
    storeData('tasks', currentTasks);  //로컬저장소에 저장
  }

  //입력필드에 포커스가 떠났을때
  const _onBlur = ()=>{
    setNewTask('');
  }

  // const width = Dimensions.get('window').width;

  return !isReady ? (
      <AppLoading
        // 앱 로딩전 실행할 로직     
        startAsync={()=>{getData('tasks')}}
        //startAsync호출이 성공적으로 수행되면
        onFinish={()=>setIsReady(true)}
        //startAsync호출이 실패하면
        onError={console.error}
     />
    ):(
    <ThemeProvider theme={theme}>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>BUCKET LIST</Title>
        <Input 
          value={newTask}
          placeholder='+ Add a Bucket'
          onChangeText={_handleTextChange}
          onSubmitEditing={_addTask}
          onBlur={_onBlur}
        />
        <List width={width}>
          {Object.values(tasks)
                 .reverse()
                 .map(task=><Task key={task.id}
                                  task={task} 
                                  deleteTask={_deleteTask}
                                  toggleTask={_toggleTask}
                                  updateTask={_updateTask}
                                  
                            />)
          }
        </List>
        <DeleteAllButton Content={'완료항목전체삭제'} />
          
      </Container>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    width: width - 40,
    backgroundColor: 'orange',
    padding: 10,
    fontSize: 24,
    fontWeight: 'bold',
    borderRadius: 5,
  },
});
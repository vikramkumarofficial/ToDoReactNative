// React Native
import React from 'react';
import {
  StyleSheet,
  CheckBox,
  Text,
  View, FlatList
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import { Appbar } from 'react-native-paper';
import Dialog from "react-native-dialog";




export default class App extends React.Component {

  state = {
    dialogVisible: false,
    filterDialog: false,
    taskToBeAdded: {},
    taskList: [],
    filter: { "all": true, "pending": false, "completed": false }
  };

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  showFilterDialog = () => {
    this.setState({ filterDialog: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };


  updateTaskList = (type, index, task) => {
    if (type == "update") {
      const updatedTask = [...this.state.taskList];
      updatedTask[index].isCompleted = !updatedTask[index].isCompleted;
      this.setState({ taskList: updatedTask });
    }
    else if (type == "delete") {
      this.setState({
        taskList: this.state.taskList.filter(item => item.key != task.key)
      });

    }

  }


  addTask = () => {
    this.setState({
      taskList: [...this.state.taskList, this.state.taskToBeAdded]
    },
      // console.log(this.state)
    );
    this.setState({ dialogVisible: false });
    //Because SetState is Async
    // console.log(this.state);
  };

  updateFilter = (type) => {
    if (type == "All") {
      this.setState({
        filterDialog: false,
        filter: { "all": true, "pending": false, "completed": false }
      });
    }
    else if (type == "Completed") {
      this.setState({
        filterDialog: false,
        filter: { "all": false, "pending": false, "completed": true }
      });
    }
    else if (type == "Pending") {
      this.setState({
        filterDialog: false,
        filter: { "all": false, "pending": true, "completed": false }
      });
    }
  }

  // filterDialog = () => {
  //   return <Dialog.Container visible={this.state.filterDialog}>
  //     <Dialog.Title>Filter Task</Dialog.Title>
  //     <Dialog.Button label="Show All" onPress={this.updateFilter("All")} />
  //     <Dialog.Button label="Show Completed" onPress={this.updateFilter("Completed")} />
  //     <Dialog.Button label="Show Pending" onPress={this.updateFilter("Pending")} />
  //   </Dialog.Container>
  // }

  handleDialogInput = (task) => {
    // console.log(task);
    this.setState({ taskToBeAdded: { "key": task, "isCompleted": false } });
  }

  toDoContainer = (task, index) => {
    // console.log(task);
    if (this.state.filter.completed && !task.isCompleted)
      return null;
    if (this.state.filter.pending && task.isCompleted)
      return null;
    return (
      <View style={styles.toDoContainer} >
        <CheckBox
          value={task.isCompleted}
          onValueChange={(value) => this.updateTaskList("update", index, task)}
        />
        <Text style={task.isCompleted ? styles.completedTask : styles.pendingTasks}>
          {task.key}
        </Text>
        <Icon.Button
          name="trash-o"
          type='FontAwesome'
          backgroundColor="#ff3300"
          onPress={() => this.updateTaskList("delete", index, task)}
        />
      </View>
    );
  }


  render() {
    return (<View style={styles.container} >
      <Appbar.Header>
        <Appbar.Content title="To Do App" />
        <Appbar.Action icon="filter" onPress={() => { this.showFilterDialog(); }} />
      </Appbar.Header>
      <Dialog.Container visible={this.state.dialogVisible}>
        <Dialog.Title>Add To Do Task</Dialog.Title>
        <Dialog.Input label="To Do" onChangeText={(task) => this.handleDialogInput(task)}></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={this.handleCancel} />
        <Dialog.Button label="Add" onPress={this.addTask} />
      </Dialog.Container>
      <Dialog.Container visible={this.state.filterDialog}>
        <Dialog.Title>Filter Task</Dialog.Title>
        <Dialog.Button label="All" onPress={() => { this.updateFilter("All"); }} />
        <Dialog.Button label="Completed" onPress={() => { this.updateFilter("Completed"); }} />
        <Dialog.Button label="Pending" onPress={() => { this.updateFilter("Pending"); }} />
      </Dialog.Container>
      <FlatList data={this.state.taskList}
        renderItem={({ item, index }) => this.toDoContainer(item, index)
        }>
      </FlatList>
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        onPress={() => {
          this.showDialog();
        }}
      />
    </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  completedTask: {
    color: '#ffad33',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontSize: 14
  },
  pendingTasks: {
    color: '#000',
    fontSize: 14
  },
  toDoContainer: {
    height: 50,
    margin: 10,
    backgroundColor: '#b3ffb3',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
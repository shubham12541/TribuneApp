import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView, Button, 
    TouchableOpacity, AsyncStorage} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from './IconComponent'

export default class SettingScreen extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontWeight: "bold"}}>Settings</Text>,
            headerRight: (
                <Button title="Done" onPress={navigation.getParam("settingDone")}></Button>
            )
        }
    }

    constructor(props){
        super(props);

        this.state = {
            data: []
        };
    }

    _storeSectionList = async (aSectionList) => {
        try{
            await AsyncStorage.setItem("@SectionList", aSectionList);
        } catch(err){
            console.log(err);
        }
    }

    _getSectionList = async () =>{
        try{
            const sectionList = await AsyncStorage.getItem("@SectionList");
            if(sectionList){
                console.log(sectionList);
                return JSON.parse(sectionList);
            } else{
                return null;
            }
        } catch(err){
            console.log(err);
            return null;
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({settingDone: this._saveSetting.bind(this)});
        

        this._getSectionList().then(sections => {
            this.setState({
                data: sections ? sections : []
            });
        });
    }

    _saveSetting(){
        this._storeSectionList(JSON.stringify(this.state.data));

        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    renderItem = ({item, index, move, moveEnd, isActive}) => {
        return (
            <TouchableOpacity style={{
                marginTop: 2,
                padding: 12,
                fontWeight: 'bold',
                fontSize: 14,
                color: '#ffffff',
                backgroundColor: isActive ? 'rgba(50,70,101,1.0)' : 'rgba(88,145,190,1.0)',
                padding: 6
            }} onLongPress={move} onPressOut={moveEnd}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>{item.title}</Text>
                    <Icon name="reorder" size={25} color="#ffffff" />
                </View>
            </TouchableOpacity>
        )
    }

    render(){

        return(
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.textHeader}>Change Order</Text>

                    <DraggableFlatList
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this.setState({ data })}
                     />

                </View>
            </ScrollView>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4
    },

    textHeader: {
        fontWeight: "bold",
        fontSize: 25,
        padding: 20
    }
});


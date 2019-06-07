import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, ScrollView, Button, 
    TouchableOpacity, AsyncStorage,FlatList} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Icon from './IconComponent';

export default class SettingScreen extends React.Component{

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: <Text style={{fontWeight: "bold"}}>Settings</Text>,
            headerRight: (
                <Icon name="checkmark-circle" size={30} color="#5E98CA" style={{marginRight: 20}} onPress={navigation.getParam("settingDone")}></Icon>
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

    _removeItem(item, index){
        // debugger;
        this.setState(prevState => {
            prevState.data[index].visible = false;
            prevState.data.push(prevState.data.splice(index, 1)[0]);

            return prevState;
        });
    }

    _addItem(item, index){
        this.setState(prevState => {
            const firstInvisibleIndex =  prevState.data.findIndex(oConfig => !oConfig.visible);
            item.visible = true;

            prevState.data.splice(index + firstInvisibleIndex, 1);
            prevState.data.splice(firstInvisibleIndex, 0, item);

            return prevState;
        });
    }

    _updateVisibleData(data){
        this.setState(prevState => {
            const invisibleSections = prevState.data.filter(oConfig => !oConfig.visible);

            prevState.data = data.concat(invisibleSections);
            return prevState;
        });
    }

    renderItem = ({item, index, move, moveEnd, isActive}) => {
        return (

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: isActive ? "#DCDCDC" : "white", padding: 4 }} >
                <Icon name="remove-circle" size={24} color="#FF4500" onPress={this._removeItem.bind(this, item, index)} />
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 8}}>
                    <Text style={{fontSize: 18}}>{item.title}</Text>
                    <TouchableOpacity onPressIn={move} onPressOut={moveEnd} >
                        <Icon name="reorder" styles={{paddingHorizontal: 10}} size={25} color="#000000" />
                    </TouchableOpacity>
                </View>
            </View>

            // <TouchableOpacity style={{
            //     marginTop: 2,
            //     padding: 12,
            //     fontWeight: 'bold',
            //     fontSize: 14,
            //     backgroundColor: isActive ? 'rgba(50,70,101,1.0)' : 'rgba(88,145,190,1.0)',
            //     padding: 6
            // }} onLongPress={move} onPressOut={moveEnd}>
            //     <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            //         <Icon name="remove-circle" size={25} color="#ff0000"  />
            //         <Text style={{color: "#ffffff"}}>{item.title}</Text>
            //         <Icon name="reorder" size={25} color="#ffffff" />
            //     </View>
            // </TouchableOpacity>
        )
    }

    _renderInvisibleItem = ({item, index}) => {
        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor : "white", padding: 4 }} >
                <Icon name="add-circle" size={24} color="#228B22" onPress={this._addItem.bind(this, item, index)} />
                <Text style={{ marginLeft: 8, fontSize: 18}}>{item.title}</Text>
            </View>
        )
    }

    render(){

        return(
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.textHeader}>Manage Sections</Text>

                    <DraggableFlatList
                        data={this.state.data.filter(oConfig => oConfig.visible)}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        scrollPercent={5}
                        onMoveEnd={({ data }) => this._updateVisibleData(data)}
                     />

                    <View style={styles.divider}></View>

                    <FlatList 
                        data={this.state.data.filter(oConfig => !oConfig.visible)}
                        keyExtractor={(item, index) => item.id + ""}
                        renderItem={this._renderInvisibleItem}
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
    },

    textSubHeader: {
        padding: 20,
        fontSize: 18
    },

    textRowItem: {
        marginTop: 2,
        padding: 12,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#ffffff',
        backgroundColor: 'rgba(88,145,190,1.0)',
        padding: 6
    },

    divider: {
        height: 3,
        backgroundColor: '#000000',
        marginTop: 8,
        marginBottom: 8
    }
});


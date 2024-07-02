import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HeadTable: ['Head1', 'Head2', 'Head3', 'Head4', 'Head5'],
            DataTable: [
                ['1', '2', '3', '4', '5'],
                ['a', 'b', 'c', 'd', 'e'],
                ['1', '2', '3', '4', '5'],
                ['a', 'b', 'c', 'd', 'e'],
                ['1', '2', '3', '4', '5']
            ]
        }
    }

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#ffa1d2' }}>
                    <Row data={state.HeadTable} style={styles.HeadStyle} textStyle={styles.TableText} />
                    <Rows data={state.DataTable} textStyle={styles.TableText} />
                </Table>
            </View>
        )
    }
}
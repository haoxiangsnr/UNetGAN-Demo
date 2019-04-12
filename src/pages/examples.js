import React from "react";
import {Col, Icon, Row,Table, Layout, Menu} from "antd"
import Link from 'umi/link';
import Header from "../components/header";
import styles from "./examples.css"
import AudioPlayer from "react-h5-audio-player";

export default class examples extends React.Component {
    render() {
        let dataSource = []
        for (let i = 0; i < 1000; i++) {
            dataSource.push({
                snr: i,
                noise: '123',
                mixture: (<AudioPlayer src="/src/assets/0900_factoryfloor2_5.wav"/>),
                clean: (<AudioPlayer src="/src/assets/0900_factoryfloor2_5.wav"/>),
                enhanced: (<AudioPlayer src="/src/assets/0900_factoryfloor2_5.wav"/>)
              })
        }
          
          const columns = [{
            title: 'SNR',
            dataIndex: 'snr',
            key: 'snr',
          }, {
            title: 'Noise',
            dataIndex: 'noise',
            key: 'noise',
          },{
            title: 'Mixture',
            dataIndex: 'mixture',
            key: 'mixture',
          },{
            title: 'Clean',
            dataIndex: 'clean',
            key: 'clean',
          },{
            title: 'Enhanced',
            dataIndex: 'enhanced',
            key: 'enhanced',
          }];
        return (
            <div>
                <Header />
                <Layout className={styles.content}>
                    <Row>
                        <Col span={14} offset={5}>
                            <Table dataSource={dataSource} columns={columns} />
                            
                        </Col>
                    </Row>
                </Layout>
            </div>
        );
    }
}
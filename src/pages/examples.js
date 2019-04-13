import React from "react";
import {Col, Icon, Row, Table,message,Spin, Layout, Menu} from "antd"
import Link from 'umi/link';
import Header from "../components/header";
import styles from "./examples.css"
import AudioPlayer from "react-h5-audio-player";
import reqwest from 'reqwest';
import Sound from "react-sound"

const SPEECH_ENHANCEMENT_URL = "http://202.207.12.167:1111";

export default class examples extends React.Component {
    state = {
        is_loading: true,
        examples_data: []
    };

    componentDidMount() {
        this.get_examples();
    }

    get_examples = () => {
        reqwest({
            url: `${SPEECH_ENHANCEMENT_URL}/get_examples`,
            method: "get",
            success: (resp) => {
                this.setState({
                    examples_data: resp.examples_data,
                    is_loading: false
                });
                message.success('Get examples successfully.');
            },
            error: () => {
                message.error("Get examples failed, Check your network.")
            }
        })
    };

    render() {
        let dataSource = [];
        let examples_data = this.state.examples_data;
        if (examples_data.length) {
            for (let i=0; i < examples_data.length; ++i) {
                let example = examples_data[i];
                dataSource.push({
                    num: example.num,
                    snr: example.snr,
                    noise: example.noise_type,
                    mixture: (<audio  controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.noisy_link}`} />),
                    clean: (<audio controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.clean_link}`} />),
                    enhanced: (<audio controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.denoisy_link}`} />)
                })
            }
        }
        const columns = [{
            title: 'Num',
            dataIndex: 'num',
            key: 'num',
        },{
            title: 'SNR',
            dataIndex: 'snr',
            key: 'snr',
        }, {
            title: 'Noise',
            dataIndex: 'noise',
            key: 'noise',
        }, {
            title: 'Mixture',
            dataIndex: 'mixture',
            key: 'mixture',
        }, {
            title: 'Clean',
            dataIndex: 'clean',
            key: 'clean',
        }, {
            title: 'Enhanced',
            dataIndex: 'enhanced',
            key: 'enhanced',
        }];

        const content = (
                <Row>
                    <Col span={18} offset={3}>
                        <Table dataSource={dataSource} columns={columns}/>
                    </Col>
                </Row>
        );

        return (
            <div>
                <Header/>
                <Layout className={styles.content}>
                    {this.state.is_loading ?  <Spin size="large" /> : content}
                </Layout>
            </div>
        );
    }
}

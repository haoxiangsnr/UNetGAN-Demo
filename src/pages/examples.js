import React from "react";
import {Col, Layout, Icon, message, Row, Spin, Table} from "antd"
import Header from "../components/header";
import styles from "./examples.css"
import reqwest from 'reqwest';

const SPEECH_ENHANCEMENT_URL = "http://202.207.12.159:1111";

export default class examples extends React.Component {
    state = {
        is_loading: true,
        examples_data: []
    };

    componentDidMount() {
        // 在即将渲染完成时请求远程端口
        // 请求成功则将取消加载动画
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
        });
    }

    render() {
        let dataSource = [];
        let examples_data = this.state.examples_data;
        if (examples_data.length) {
            for (let i = 0; i < examples_data.length; ++i) {
                let example = examples_data[i];
                dataSource.push({
                    num: example.num,
                    snr: example.snr,
                    noise: example.noise_type,
                    mixture: (
                        <audio controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.noisy_link}`}/>),
                    clean: (<audio controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.clean_link}`}/>),
                    enhanced: (
                        <audio controls autoPlay={false} src={`${SPEECH_ENHANCEMENT_URL}/${example.denoisy_link}`}/>)
                })
            }
        }
        const columns = [{
            title: 'Num',
            dataIndex: 'num',
            key: 'num',
            filters: [{text: "1", value: "1"}, {text: "2", value: "2"}],
            onFilter: (value, record) => record.num.indexOf(value) === 0,
        }, {
            title: 'SNR',
            dataIndex: 'snr',
            key: 'snr',
            filters: [
                {text: "0", value: "0"},
                {text: "-3", value: "-3"},
                {text: "-5", value: "-5"},
                {text: "-7", value: "-7"},
                {text: "-10", value: "-10"},
                {text: "-12", value: "-12"},
                {text: "-15", value: "-15"},
                {text: "-17", value: "-17"},
                {text: "-20", value: "-20"},
            ],
            onFilter: (value, record) => record.snr.indexOf(value) === 0,
        }, {
            title: 'Noise',
            dataIndex: 'noise',
            key: 'noise',
            filters: [
                {text: "factoryfloor1", value: "factoryfloor1"},
                {text: "destroyerops", value: "destroyerops"},
                {text: "babble", value: "babble"},
                {text: "factoryfloor2", value: "factoryfloor2"},
                {text: "destroyerengine", value: "destroyerengine"},
            ],
            onFilter: (value, record) => record.noise.indexOf(value) === 0,
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
            <div>
                <Row>
                    <Col span={20} offset={2}>
                        <p style={{fontSize: "16px"}}>
                            <Icon type="notification" theme="twoTone" />: The table below lists the two speeches in the test set at different SNRs (0dB, -3dB, -5dB, -7dB, -10dB, -12dB, -15dB, -17dB, -20dB) and different noises (babble, destroyerengine, destroyerops, factoryfloor1, factoryfloor2). You can also set the filter by clicking the "<Icon type="filter" theme="filled" />" button at the header of the table.
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col span={20} offset={2}>
                        <Table dataSource={dataSource} columns={columns}/>
                    </Col>
                </Row>
            </div>
        );

        return (
            <div>
                <Header selectedKeys="2"/>
                <Layout className={styles.content}>
                    {this.state.is_loading ? <Spin size="large"/> : content}
                </Layout>
            </div>
        );
    }
}

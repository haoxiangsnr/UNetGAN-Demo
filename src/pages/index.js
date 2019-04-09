import styles from './index.css';
import React from "react";
import {Button, Col, Icon, Layout, List, Menu, message, notification, Row, Upload} from "antd"
import reqwest from 'reqwest';

const {Header, Content, Footer} = Layout;

const SPEECH_ENHANCEMENT_URL = "http://202.207.12.159:5000";
export default class IndexPage extends React.Component {
    state = {
        file: {},
        uploading: false,
        downloadURL: ""
    };

    openNotificationWithIcon = (type, mess, des) => {
        notification[type]({
            message: mess,
            description: des,
        });
    };

    handleChange = (info) => {
        if (info.file.size <= 2000000) {
            if (info.file.name.slice(-3) === "wav") {
                this.setState({
                    file: info.file
                });
            } else {
                this.openNotificationWithIcon("error", "Wrong file format", "The uploaded file should be in wav format. Please try again.")
            }
        } else {
            this.openNotificationWithIcon("error", "File size exceeds limit", "Uploaded files should be less than 2M, please try again.")
        }

    };

    handleUpload = () => {
        const {file} = this.state;
        const formData = new FormData();

        formData.append('noisy_speech', file);

        this.setState({
            uploading: true,
        });

        reqwest({
            url: `${SPEECH_ENHANCEMENT_URL}/enhancement`,
            method: "post",
            processData: false,
            data: formData,
            success: (resp) => {
                this.setState({
                    file: {},
                    uploading: false,
                    downloadURL: SPEECH_ENHANCEMENT_URL + "/" + resp.deno_wav
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            }
        });
    };


    render() {
        const {uploading, file, downloadURL} = this.state;
        let downloadEle = null;
        if (downloadURL) {
            downloadEle = (
                <Button style={{marginTop: 16}}>
                    <Icon type="upload"/>
                    <a href={downloadURL} target="blank"> Download enhanced speech</a>
                </Button>
            );
        }
        let fileList = [];
        if (Object.keys(file).length !== 0) {
            fileList = [file]
        } else {
            fileList = [];
        }
        const BannerDataSource = [
            (<div>1. The size of the uploaded file is 2MB or less, and the format is required to be wav format. The
                recommended sampling rate is 16000 Hz. The recommended SNR of the noisy speech is 0~-20dB.</div>),
            (<div>2. We randomly select 40 speakers from the <a href="https://catalog.ldc.upenn.edu/LDC93S1">TIMIT
                corpus</a> and then use the first 7 sentences of each speaker as the training utterance. We employ
                babble, factoryfloor1, destroyerengine and destroyerops from <a
                    href="http://spib.linse.ufsc.br/noise.html">NOISEX-92</a> corpus for training. We mix the 280
                utterance with these noise under 0dB, -5dB, -10dB and -15dB SNRs to create the training dataset for the
                model. </div>),
            (<div>3. You can use <a href="https://github.com/mpariente/pystoi">STOI</a> (Short-Time Objective
                Intelligibility) and <a href="https://www.itu.int/rec/T-REC-P.862">PESQ</a> (Perceptual evaluation of
                speech quality) as measures to evaluate the quality and intelligibility of the enhanced speech
                separately.</div>),
            (<div>4. Please use the latest version of modern browsers, such as the latest version of <a
                href="https://www.google.com/chrome/">Google Chrome</a> and <a
                href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>.</div>)
        ];

        const props = {
            fileList: fileList,
            onChange: this.handleChange,
            beforeUpload: () => {
                return false;
            },
            onRemove: () => {
                this.setState((state) => {
                    this.setState({
                        file: {}
                    });
                });
            },
        };

        return (
            <div className={styles.normal}>
                <Layout>
                    <Header className={styles.header}>
                        <div className={styles.title}><Icon type="api"/>Speech Processing</div>
                        <Menu theme="light" mode="horizontal" className={styles.menu}>
                            <Menu.Item key="1">Speech Enhancement</Menu.Item>
                        </Menu>
                    </Header>
                </Layout>
                <Row className={styles.banner}>
                    <Col span={14} offset={5}>
                        <List
                            dataSource={BannerDataSource}
                            bordered={true}
                            header="Notification"
                            renderItem={item => (<List.Item> {item} </List.Item>)}
                        />
                    </Col>
                </Row>
                <Layout className={styles.content}>
                    <Row>
                        <Col span={14} offset={5}>
                            <Upload {...props}>
                                <Button><Icon type="upload"/>Select noisy speech</Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={14} offset={5}>
                            <Button
                                type="primary"
                                onClick={this.handleUpload}
                                disabled={fileList.length === 0}
                                loading={uploading}
                                style={{marginTop: 16}}>
                                {uploading ? 'Waiting' : 'Start Enhancement'}
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={14} offset={5}>
                            {downloadEle}
                        </Col>
                    </Row>
                </Layout>
            </div>
        );
    }
}

import styles from './header.css';
import React from "react";
import {Col, Icon, Layout, Menu} from "antd"
import Link from 'umi/link';

const {Header} = Layout;

export default class header extends React.Component {
    render() {
        return (
            <div className={styles.normal}>
                <Layout>
                    <Header className={styles.header}>
                        <div className={styles.title}><Icon type="api"/>Speech Processing</div>
                        <Menu theme="light" mode="horizontal" className={styles.menu}>
                            <Menu.Item key="1"><Link to="/">Speech Enhancement</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/examples">Examples</Link></Menu.Item>
                        </Menu>
                    </Header>
                </Layout>
            </div>
        );
    }
}
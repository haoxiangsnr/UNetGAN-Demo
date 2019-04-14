import styles from './header.css';
import React from "react";
import {Col, Icon, Layout, Menu} from "antd"
import Link from 'umi/link';
import BasicLayout from "@/layouts";

const {Header} = Layout;

function header(props) {
    return (
        <div className={styles.normal}>
            <Layout>
                <Header className={styles.header}>
                    <div className={styles.title}><Icon type="api"/>Speech Processing</div>
                    <Menu theme="light" mode="horizontal" className={styles.menu} selectedKeys={props.selectedKeys}>
                        <Menu.Item key="1"><Link to="/">Speech Enhancement Online</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/examples">Sample Files</Link></Menu.Item>
                    </Menu>
                </Header>
            </Layout>
        </div>
    );
};

export default header

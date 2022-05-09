const reportData = {
    "test_name": "测试名称",
    "generate_time": "2022-02-17",
    "version": "版本好",
    "start_time": "2022-02-17 13:50:00",
    "end_time": "2022-02-17 18:02:00",
    "test_status": "完成",
    "kpsi": 10, //安全指数
    "risk_number": 11,
    "serious_vuln_number": 10,
    "high_vuln_numberr": 12,
    "medium_vuln_number": 58,
    "low_vuln_number": 10,
    "host_number": 10,
    "port_number": 29,
    "domain_number": 10,
    "site_number": 7,
    "impact_statistics": {
        "cloud_key": 1,
        "code_store": 1,
        "container": 5,
        "controlled_host": 10,
        "credential": 5,
        "database": 1,
        "file": 2,
        "sens_info": 7
    },
    "configuration": {
        "test_name": "测试名称",
        "test_target": ["192.168.1.1", "192.168.1.0/24"],
        "exclude_target": ["192.168.1.9", "192.168.1.2"],
        "port_type": "全端口",
        "module_config": {
            "password_burst": [
                {
                    "name": "FTP弱口令",
                    "status": 1 // 1是绿色框，0是白色框
                },
                {
                    "name": "SQL Server弱口令",
                    "status": 1
                },
                {
                    "name": "MySQL弱口令",
                    "status": 1
                },
                {
                    "name": "postgresql弱口令",
                    "status": 1
                },
                {
                    "name": "Redis弱口令",
                    "status": 1
                },
                {
                    "name": "SMB弱口令",
                    "status": 1
                },
                {
                    "name": "SSH弱口令",
                    "status": 1
                },
                {
                    "name": "Telnet弱口令",
                    "status": 1
                }
            ],
            "other_burst": [
                {
                    "name": "子域名爆破",
                    "status": 0
                },
                {
                    "name": "DNS爆破",
                    "status": 0
                }
            ],
            "password_validation": [
                {
                    "name": "密码喷射",
                    "status": 0
                },
                {
                    "name": "域用户验证",
                    "status": 0
                },
                {
                    "name": "凭证重用",
                    "status": 0
                }
            ],
            "middle_attack": [
                {
                    "name": "Net-NTLM Hash 传递攻击",
                    "status": 1
                },
                {
                    "name": "NetBIOS名称欺骗和LLMNR欺骗",
                    "status": 0
                }
            ],
            "cause_harm_exploit": [
                {
                    "name": "SMB远程溢出(永恒之蓝)(MS17-010)",
                    "status": 0
                },
                {
                    "name": "Windows 远程桌面服务远程代码执行 (CVE-2019-0708)",
                    "status": 0
                },
                {
                    "name": "Windows域服务权限提升漏洞(CVE-2021-42287, CVE-2021-42278)",
                    "status": 0
                }
            ],
            "post_penetration": [
                {
                    "name": "使用Mimikatz提取Windows账户",
                    "status": 1
                },
                {
                    "name": "获取Linux用户密码",
                    "status": 1
                }
            ]
        },
        "other_config": {
            "company_domains": ["vackbot.com", "moyunsec.com"],
            "git_accounts": ["用户1", "用户2", "用户3"],
            "other_accounts": [{
                "username": "admin",
                "password": "admin",
            }, {
                "username": "admin1",
                "password": "admin1"
            }
            ]
        }
    },
    "impact_details": {
        "host": {
            "describe": "我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述",
            "targets": [
                {
                    "target": "192.168.1.235",
                    "methods": [
                        "我是方式1",
                        "我是方式2",
                        "我是方式3"
                    ]
                }, {
                    "target": "192.168.1.237",
                    "methods": [
                        "我是方式1",
                        "我是方式2",
                        "我是方式3"
                    ]
                }
            ]
        },
    },
    "vuln_details": {
        "serious_vuln": [
            {
                "name": "远程文件包含xss",
                "describe": "我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述",
                "refers": ["http://refere.com/1.php", "http://refere.com/1.php"],
                "solution": "1.建议受影响的用户升级至官方最新版本2.未能及时安装新版的，可限制只允许可信源IP访问",
                "targets": [
                    {
                        "target": "192.168.1.135",
                        "position": "445",
                        "verification": 1 // 1是已验证，0是未验证
                    },
                    {
                        "target": "192.168.1.135",
                        "position": "445",
                        "verification": 0
                    }
                ]
            }
        ],
        "high_vuln": [],
        "medium_vuln": [],
        "low_vuln": []
    }
}

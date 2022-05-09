const reportData = {
  "plan_name": "Test",
  "date": "2022-4-24",
  "company_name": "北京墨云科技有限公司",
  "exec_summary": {
      "plan_name": "Test",
      "create_time": "2022-04-24",
      "end_time": "",
      "timezone": "",
      "plan_status": "",
      "plan_batch": "",
      "score": 79,
      "risk_level": "严重",
      "area_count": 6,
      "scenario_count": 1000,
      "simulator_count": 10,
      "intercept": 10,
      "intercept_pct": "10%",
      "notintercepted": 20,
      "notintercepted_pct": "20%",
      "unexecuted": 30,
      "unexecuted_pct": "30%",
      "warning": 40,
      "warning_pct": "40%",
      "exec_time": 3660,
      "risk_trend": [
          {
              "risk_day": "2022-04-13",
              "cnt": {
                  "intercept": 4,
                  "notintercepted": 6,
                  "unexecuted": 3,
                  "warning": 7
              }
          },
          {
              "risk_day": "2022-04-14",
              "cnt": {
                  "intercept": 1,
                  "notintercepted": 8,
                  "unexecuted": 9,
                  "warning": 4
              }
          },
          {
              "risk_day": "2022-04-15",
              "cnt": {
                  "intercept": 7,
                  "notintercepted": 1,
                  "unexecuted": 5,
                  "warning": 9
              }
          }
      ],
      "attack_trend": "incre",
      "attack_change": 200,
      "trend_action": "up"
  },
  "safecontrol_risk_trend": {
      "scenario_count": 10,
      "safecontrol_count": 4,
      "statistics": [
          {
              "safecontrol": "xxx",
              "hardware": ['q','w'],
              "simulator": ['e','r'],
              "scenario_count": 2,
              "intercept": 0,
              "notintercepted": 0,
              "unexecuted": 0,
              "warning": 0,
              "success_pct": "10%"
          }
      ],
      "pct_distribution": [
        {
          "safecontrol": "a",
          "intercept": 1,
          "notintercepted": 5,
          "unexecuted": 2,
          "warning": 3
        },
        {
          "safecontrol": "s",
          "intercept": 7,
          "notintercepted": 1,
          "unexecuted": 2,
          "warning": 5
        },
        {
          "safecontrol": "d",
          "intercept": 6,
          "notintercepted": 2,
          "unexecuted": 3,
          "warning": 5
        },
        {
          "safecontrol": "f",
          "intercept": 4,
          "notintercepted": 9,
          "unexecuted": 1,
          "warning": 2
        }
      ],
      "result": [
          {
              "safecontrol": "a",
              "scenario_name": "s",
              "test_result": "d",
              "attacker": "f",
              "victim": "g",
              "area": [1,2],
              "hardware": [3,2]
          }
      ]
  },
  "area_risk_trend": {
      "simulator_count": 4,
      "attacker_simulator_count": 4,
      "victim_simulator_count": 4,
      "area_count": 3,
      "scenario_count": 10,
      "pct_distribution": [
        {
          "area": "1111",
          "simulator_count": 10,
          "intercept_pct": "10%",
          "notintercepted_pct": '20%',
          "unexecuted_pct": "30%",
          "warning_pct": "40%"
        },
        {
          "area": "2222",
          "simulator_count": 20,
          "intercept_pct": "20%",
          "notintercepted_pct": '30%',
          "unexecuted_pct": "10%",
          "warning_pct": "40%"
        },
        {
          "area": "3333",
          "simulator_count": 20,
          "intercept_pct": "20%",
          "notintercepted_pct": '30%',
          "unexecuted_pct": "10%",
          "warning_pct": "40%"
        }
      ],
      "statistics": [
          {
              "area": "safs",
              "attacker": "dsa",
              "victim": "da",
              "scenario_count": "12",
              "intercept": 4,
              "notintercepted": 3,
              "warning": 2,
              "unexecuted": 1,
              "hardware": []
          }
      ],
      "result": [
        {
          "area": "",
          "scenario_name": "s",
          "test_result": "s",
          "attacker": "s",
          "victim": "s",
          "hardware": []
        },
        {
          "area": "",
          "scenario_name": "d",
          "test_result": "d",
          "attacker": "d",
          "victim": "d",
          "hardware": []
        }
      ]
  },
  "miter_attack": {
    "tactics": [
      {
        "name": "Reconnaissance",
        "id": "TA0043"
      },
      {
        "name": "测试",
        "id": "TA0042"
      }
    ],
    "techniques": [
      {
        "tactic": [
          "TA0043",
          "TA0042"
        ],
        "technique": {
          "name": "Active Scanning",
          "id": "T1595",
          "level": 3
        }
      },
      {
        "tactic": [
          "TA0043"
        ],
        "technique": {
          "name": "主动扫描",
          "id": "T1",
          "level": 6
        }
      },
      {
        "tactic": [
          "TA0043"
        ],
        "technique": {
          "name": "自动渗出",
          "id": "T2",
          "level": 8
        }
      },
      {
        "tactic": [
          "TA0043"
        ],
        "technique": {
          "name": "动态连接",
          "id": "T3",
          "level": 1
        }
      },
      {
        "tactic": [
          "TA0043"
        ],
        "technique": {
          "name": "fdsgdsg",
          "id": "T4"
        }
      }
    ],
    "statistics": [
      {
        "tactics": "Reconnaissance",
        "scenario_count": 100,
        "intercept": 10,
        "intercept_pct": "10%",
        "notintercepted": 30,
        "notintercepted_pct": "30%",
        "unexecuted": 20,
        "unexecuted_pct": "20%",
        "warning": 40,
        "warning_pct": "40%"
      },
      {
        "tactics": "Reconnaissance",
        "scenario_count": 200,
        "intercept": 40,
        "intercept_pct": "20%",
        "notintercepted": 20,
        "notintercepted_pct": "10%",
        "unexecuted": 100,
        "unexecuted_pct": "50%",
        "warning": 40,
        "warning_pct": "20%"
      }
    ],
    "result": [
      {
        "tactics": "Reconnaissance",
        "technique": [],
        "scenario_name": "1",
        "test_result": "2",
        "attacker": "3",
        "victim": "4",
        "area": [],
        "hardware": []
      }
    ]
  },
  "group": {
      "scenario_count": "100",
      "group_count": 100,
      "malware_count": 100,
      "ransomware_count": 100,
      "pct_distribution": [
        {
          "group_name": "fa",
          "scenario_count": "100",
          "warning": 30,
          "warning_pct": "30%",
          "intercept": 40,
          "intercept_pct": "40%",
          "notintercepted": 10,
          "notintercepted_pct": "10%",
          "unexecuted": 20,
          "unexecuted_pct": "20%"
        }
      ],
      "result": [
        {
          "group_name": "1",
          "scenario_name": "2",
          "test_result": "3",
          "attacker": "4",
          "victim": "5",
          "area": [1,2],
          "hardware": [2,3,4]
        }
      ]
  },
  "attack_details": {
    "statistics": [
      {
        "test_result": "1",
        "scenario_name": "2",
        "tactic": [],
        "attacker": "3",
        "victim": "4",
        "area": [],
        "hardware": []
      }
    ],
    "scenario_detail": [
      {
        "scenario_name": "2",
        "test_result": "3",
        "desc": "这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本，这是测试剧本",
        "exec_summary": {
          "attacker": {
            "os": [1,2],
            "ip": "10.10.10.10",
            "simulator": 1,
            "port": 10
          },
          "victim": {
            "os": [2,3],
            "ip": "10.10.10.11",
            "simulator": 1,
            "port": 10
          }
        },
        "simulation_info": {
          "attack": [1,2,3],
          "safecontrol": [1,2,3],
          "exec_time": "2312"
        },
        "steps": [
          [
            {
              "time": "11",
              "action": "11",
              "result": "11",
              "param": "11"
            },
            {
              "time": "12",
              "action": "12",
              "result": "12",
              "param": "12"
            }
          ],
          [
            {
              "time": "21",
              "action": "21",
              "result": "21",
              "param": "21"
            },
            {
              "time": "22",
              "action": "22",
              "result": "22",
              "param": "22"
            }
          ]
        ]
      }
    ],
    "solution": [
      {
        "name": "aaa",
        "link": "fafdafd"
      }
    ]
  },
  "hardware": [
    {
      "safecontrol": "1",
      "manufacturer": "2",
      "product": "3",
      "area": [1,2]
    }
  ],
  "solution": [
    {
      "name": "aaa",
      "desc": "qewwqe"
    },
    {
      "name": "yyy",
      "desc": "fsf"
    }
  ]
};

<template>
  <div id="g6-demo" />
</template>
<script>
import G6 from '@antv/g6'
export default {
  name: 'G6Demo',
  data() {
    return {}
  },
  mounted() {
    this.initDemo()
  },
  methods: {
    drawTooltip(e) {
      console.log(e)
    },
    initDemo() {
      // 自定义节点样式
      G6.registerNode(
        'multipleLabelsNode',
        {
          options: {
            size: 160,
            style: {
              lineWidth: 0,
              fill: 'r(0.8, 0.3, 0.8) 0:#8CAAF2 1:#1954E4',
              shadowColor: '#8CAAF2',
              shadowBlur: 16,
              fillOpacity: 0.65
            },
            stateStyles: {
              hover: {
                fill: 'r(0.8, 0.3, 0.8) 0:#8CAAF2 1:#1954E4',
                fillOpacity: 1,
                cursor: 'move' // 鼠标放到非label的位置，可交互
              },
              // 选中节点状态下的配置
              selected: {
                lineWidth: 3
              }
            }
          },
          // 绘制节点
          draw(cfg, group) {
            var shape = this.drawShape(cfg, group)
            if (cfg.label && cfg.label.length) {
              this.drawLabel(cfg, group)
            }
            return shape
          },
          // 绘制label
          drawLabel(cfg, group) {
            var size = this.getSize(cfg)
            var width = size[0]
            // const height = size[1];
            var label = cfg.label
            if (label.length === 1) {
              // 绘制第一个label
              group.addShape('text', {
                attrs: {
                  text: label[0] || '',
                  x: 0 - width / 2 + 5,
                  y: 0,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: '700',
                  textBaseline: 'middle',
                  fontFamily: 'siYuan'
                }
              })
            } else if (label.length === 2) {
              // 绘制第一个label
              group.addShape('text', {
                attrs: {
                  text: label[0] || '',
                  x: 0 - width / 2 + 8,
                  y: -10,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: '700',
                  fontFamily: 'siYuan'
                }
              })
              // 绘制第二个label
              group.addShape('text', {
                attrs: {
                  text: label[1] || '',
                  x: -30,
                  y: 60,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 56,
                  fontWeight: '600',
                  fontStyle: 'italic',
                  fontFamily: 'mont'
                }
              })
            } else if (label.length === 3) {
              // 绘制第一个label
              group.addShape('text', {
                attrs: {
                  text: label[0] || '',
                  x: 0 - width / 2 + 8,
                  y: -10,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 18,
                  fontWeight: '700',
                  fontFamily: 'siYuan'
                }
              })
              // 绘制第二个label
              group.addShape('text', {
                attrs: {
                  text: label[1] || '',
                  x: -30,
                  y: 60,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 56,
                  fontWeight: '600',
                  fontStyle: 'italic',
                  fontFamily: 'mont'
                }
              })
              // 绘制第三个label
              group.addShape('text', {
                attrs: {
                  text: label[2] || '',
                  x: 30,
                  y: 52,
                  fill: '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 24,
                  fontWeight: '400',
                  fontStyle: 'italic',
                  fontFamily: 'mont'
                }
              })
            }
          }
        },
        'circle'
      )

      var data = {
        nodes: [
          {
            x: 150,
            y: 200,
            label: [''],
            tooltip:
              '上面的实例代码中，我们在实例化 Graph 时候，通过 nodeStateStyles 定义了交互状态 hover 和业务状态running，当用户操作过程中，鼠标 hover 到某个节点上时，节点的填充色就会变为指定的颜色',
            id: 'node1',
            // labelCfg: {
            //   position: 'center'
            // },
            img: require('../../../assets/AntvG6/System-Globe-icon.png'),
            type: 'image',
            size: 50
            // // 连线的锚点
            // anchorPoints: [
            //   [0, 0.5],
            //   [1, 0.5]
            // ]
          },
          {
            x: 600,
            y: 200,
            label: ['这个文案也有点长'],
            tooltip:
              '上面的实例代码中，我们在实例化 Graph 时候，通过 nodeStateStyles 定义了交互状态 hover 和业务状态running，当用户操作过程中，鼠标 hover 到某个节点上时，节点的填充色就会变为指定的颜色',
            id: 'node2',
            type: 'multipleLabelsNode'
          },
          {
            x: 450,
            y: 500,
            label: ['这个文案也有点长', 'B', '16'],
            tooltip:
              '上面的实例代码中，我们在实例化 Graph 时候，通过 nodeStateStyles 定义了交互状态 hover 和业务状态running，当用户操作过程中，鼠标 hover 到某个节点上时，节点的填充色就会变为指定的颜色',
            id: 'node3',
            type: 'multipleLabelsNode'
          }
        ],
        edges: [
          {
            source: 'node1',
            target: 'node2',
            label: 'label上面这个文本太长了我需要换行',
            labelCfg: {
              refY: 15
            },
            style: {
              endArrow: true
            }
          }
        ]
      }
      // 鼠标悬浮框
      const tooltip = new G6.Tooltip({
        offsetX: 0,
        offsetY: -80,
        shouldBegin: (e) => {
          // 点中label文字，e.target.cfg.type为text。点中空白区域，e.target.cfg.type为基础节点类型，如'circle'
          // 返回为false即阻止当前行为发生
          if (e.target.cfg.type === 'text') return true
          return false
        },
        trigger: 'click',
        itemTypes: ['node'],
        getContent: (e) => {
          this.drawTooltip(e.target.cfg.type)
          const outDiv = document.createElement('div')
          const style = `width:200px;word-break:break-all;white-space:pre-wrap;`
          outDiv.innerHTML = `
            <h3>Custom Content</h3>
            <div>
              <div style=${style}>${e.item.getModel().tooltip}</div>
            </div>`
          return outDiv
        }
      })
      var graph = new G6.Graph({
        container: 'g6-demo',
        width: 1000,
        height: 600,
        fitView: true,
        plugins: [tooltip],
        // nodeStateStyles: {
        //   hover: {
        //     fill: '#1890ff'
        //   },
        //   running: {
        //     stroke: 'steelblue'
        //   }
        // },
        // edgeStateStyles: {
        //   hover: {
        //     opacity: 0.6
        //   }
        // },
        // defaultNode: {
        //   style: {
        //     fill: '#87e8de'
        //   },
        //   color: '#87e8de'
        // },
        // defaultEdge: {
        //   color: '#bae7ff'
        // },
        modes: {
          default: [
            {
              type: 'drag-node',
              delegate: false
            },
            'drag-canvas',
            {
              type: 'zoom-canvas',
              sensitivity: 0.5
            }
          ]
        }
      })
      // 解决字符串过长问题，显示...
      // 计算字符串的长度
      var calcStrLen = (str) => {
        var len = 0
        for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++
          } else {
            len += 2
          }
        }
        return len
      }
      // 计算显示的字符串
      var fittingString = (str, maxWidth, fontSize) => {
        var fontWidth = fontSize * 1 // 字号+边距
        maxWidth = maxWidth * 1 // 需要根据自己项目调整
        var width = calcStrLen(str) * fontWidth
        var ellipsis = '…'
        if (width > maxWidth) {
          var actualLen = Math.floor((maxWidth - 10) / fontWidth)
          var result = str.substring(0, actualLen) + ellipsis
          return result
        }
        return str
      }
      // 直接修改原生数据中的label字段
      data.nodes.forEach(function(node) {
        return (node.label[0] = fittingString(node.label[0], 150, 18))
      })
      data.edges.forEach(function(edge) {
        return (edge.label = fittingString(edge.label, 200, 18))
      })
      // 事件监听
      graph.on('node:mouseenter', (e) => {
        graph.setItemState(e.item, 'hover', true)
      })
      graph.on('node:mouseleave', (e) => {
        graph.setItemState(e.item, 'hover', false)
      })

      graph.data(data)
      graph.render()
    }
  }
}
</script>
<style lang="scss" scoped></style>

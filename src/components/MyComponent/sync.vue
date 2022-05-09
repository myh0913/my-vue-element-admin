<template>
  <div class="container">
    <h2>组件间通信</h2>
    <h3>子(sync.vue)传父(father-sync)：</h3>
    <div class="single-util">
      <div class="utilMeta">
        <p>这是子组件，子组件的值：{{ age }}</p>
        <el-button @click="changeAge">在子组件中更新age</el-button>
        <slot name="comAge" />
      </div>
      <ShowUtilHtml :util-html="updateProp" />
    </div>
    <h3>父(father-sync)传子(sync.vue)：</h3>
    <div class="single-util">
      <div class="utilMeta">
        <p>这是子组件，子组件的值：{{ name }}</p>
        <el-button @click="changeName">子组件暴露方法，在父组件中修改name</el-button>
        <slot name="comName" />
      </div>
      <ShowUtilHtml :util-html="father2son" />
    </div>
    <h3>祖先(father-sync)传子(sync.vue)：</h3>
    <div class="single-util">
      <div class="utilMeta">
        <p>这是子组件，子组件的值：{{ source.num }}</p>
        <slot name="comSource" />
        <p>$attrs和$listeners</p>
        <SyncSon v-bind="$attrs" v-on="$listeners" />
      </div>
      <ShowUtilHtml :util-html="source2son" />
    </div>
  </div>
</template>
<script>
import ShowUtilHtml from '@/components/MyComponent/showUtilHtml.vue'
import SyncSon from '@/components/MyComponent/syncSon.vue'
export default {
  name: 'UpdateSync',
  components: {
    ShowUtilHtml,
    SyncSon
  },
  inject: ['source'],
  inheritAttrs: false,
  props: {
    age: {
      type: String,
      default: '这是默认值'
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      updateProp: `
      子组件sync.vue：
        <p>这是子组件，子组件的值：{{ age }}</p>
        <el-button @click="changeAge">在子组件中更新age</el-button>
        ...
        props: {
          age: {
            type: String,
            default: ''
          }
        },
        methods: {
          changeAge() {
            this.$emit('update:age', '12345')
          }
          // $parent和$children不推荐使用，因为找不到源头
          // console.log(this.$parent.myAge)
        }

      父组件component-sync：
        <Sync :age.sync="myAge"></Sync>
        ...
        data() {
          return {
            myAge: ''
          }
        },
        mounted() {
          console.log(this.myAge)
        }
      `,
      father2son: `
      prop 只可以从上一级组件传递到下一级组件（父子组件），即所谓的单向数据流。而且 prop 只读，不可被修改，所有修改都会失效并警告。

      子组件：
        <el-button @click="changeName">子组件暴露方法，在父组件中修改name</el-button>
        ...
        props: {
          name: {
            type: String,
            default: ''
          }
        },
        methods: {
          changeName() {
            this.$emit('click', this.name)
          }
        }

      父组件：
        <Sync :name="myName" @click="clickSon">
        ...
        data() {
          return {
            myName: ''
          }
        },
        methods: {
          clickSon(value) {
            this.myName = '用子组件暴露的方法点了一下'
          }
        }
      `,
      source2son: `
      祖先组件传值给子孙组件
      祖先组件provide，子孙组件inject。
      如果要使provide变为响应式的，必须将provide写为对象类型

      $attrs、$listeners、inheritAttrs
      使用场景，祖先组件想要获取子孙组件的属性和方法，子孙组件的属性和方法无法暴露在外面，只能通过props和$emit一个个添加，这时候可以使用$attrs与$listeners。

        $attrs:
        当组件在调用时传入的属性没有在props里面定义时，
        传入的属性将被绑定到$attrs属性内（class与style除外，
        他们会挂载到组件最外层元素上）。
        并可通过v-bind="$attrs"传入到内部组件中

        $listeners:
        当组件被调用时，外部监听的这个组件的所有事件都可以通过$listeners获取到。并可通过v-on="$listeners"传入到内部组件中。

        inheritAttrs: false
        默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings)
        将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。
        通过设置 inheritAttrs 到 false，这些默认行为将会被去掉

        父组件：
        <Sync type="danger"></Sync>

        子组件：
        <el-button v-bind="$attrs" v-on="$listeners">确定</el-button>
        ...
        export default {
          inheritAttrs: false
        }
      `
    }
  },
  methods: {
    changeAge() {
      this.$emit('update:age', '12345')
    },
    changeName() {
      this.$emit('click', this.name)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.container {
  @include flex(flex-start, flex-start, column);
  .single-util {
    width: 100%;
    height: auto;
    border: 1px solid lightgray;
    border-radius: 4px;
    .utilMeta {
      width: 100%;
      height: auto;
      padding: 20px;
      border-bottom: 1px solid lightgray;
    }
  }
}
h3 {
  margin: 16px 0 8px 0;
}
p {
  margin: 8px 0;
}
</style>

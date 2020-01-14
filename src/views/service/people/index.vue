<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.menuName" :placeholder="$t('table.menu.menuName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>

    </div>

    <el-table
      v-loading="listLoading"
      row-key="id"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children'}"
    >
      <!-- 序号 -->
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 服务站名称 -->
      <el-table-column :label="$t('table.people.name')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- 手机 -->
      <el-table-column :label="$t('table.people.phone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 性别 -->
      <el-table-column :label="$t('table.people.sex')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>

      <!-- 县/区 -->
      <el-table-column :label="$t('table.people.address')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <!-- 详细地址 -->
      <el-table-column :label="$t('table.people.stname')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.stname }}</span>
        </template>
      </el-table-column>

      <!-- 年龄 -->
      <el-table-column :label="$t('table.people.age')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>

      <!-- 激活日期 -->
      <el-table-column :label="$t('table.people.create_time')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.details') }}
          </el-button> -->
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 100%;">
        <div style="display:flex;width:100%">
          <div style="width:50%">
            <el-form-item :label="$t('table.people.nameCrab')" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item :label="$t('table.people.address ')" prop="address ">
              <el-input v-model="temp.address " />
            </el-form-item>
            <el-form-item :label="$t('table.people.sex')" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio v-for="item in sex" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>

          </div>
          <div style="width:50%;margin-left:10px">
            <el-form-item :label="$t('table.people.phone')">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item :label="$t('table.people.age')" prop="age">
              <el-input v-model="temp.age" />
            </el-form-item>
            <el-form-item :label="$t('table.people.stname')">
              <wlTreeSelect v-model="temp.stationId" :data="treeData" style="width:177.75px;" @change="hindleChanged" />
            </el-form-item>
            <!-- <el-form-item :label="$t('table.menu.visible')" prop="visible">
              <el-radio-group v-model="temp.visible">
                <el-radio v-for="item in visible" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('table.distributor.state')" prop="state">
              <el-input v-model="temp.status" />
            </el-form-item> -->

          </div>
        </div>
        <el-form-item v-if="dialogStatus != 'update'" :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import { add, del, edit, list, queryById, queryName } from '@/api/people'
import Pagination from '@/components/Pagination'
const sex = [
  { key: '0', display_name: '女' },
  { key: '1', display_name: '男' }
]

const visible = [
  { key: '0', display_name: '启用' },
  { key: '1', display_name: '隐藏' }
]

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        menuName: '',
        visible: '',
        page: 1,
        limit: 20
      },
      visible,
      sex,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: 'dealername is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        province: [{ required: true, message: 'code is required', trigger: 'change' }],
        city: [{ required: true, message: 'num is required', trigger: 'change' }],
        sex: [{ required: true, message: 'sex is required', trigger: 'change' }],
        county: [{ required: true, message: 'area is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        waiterPhone: [{ required: true, message: 'service is required', trigger: 'change' }]
      },
      temp: {
        name: '',
        address: '',
        phone: '',
        sex: '1',
        stname: '0',
        stationId: '0'
      },
      dialogStatus: '',
      treeData: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(res => {
        if (res.code === 200) {
          console.log(res)
          this.list = res.rows
          this.total = res.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    // 获取菜单tree
    // getAllMenuName() {
    //   getAllMenuName().then(res => {
    //     if (res.code === 200) {
    //       this.treeData = res.data
    //     }
    //   })
    // },
    resetTemp() {
      this.temp = {
        name: '',
        address: '',
        phone: '',
        sex: '1',
        stname: '0',
        stationId: '0'
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 注销
    handleCance(id) {
      issue({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 冻结
    handleReco(id) {
      pause({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 添加
    handleCreate() {
      // this.getList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      queryName(this.temp).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          console.log(res.data)
        }
      })
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          add(this.temp).then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 查看详情
    handleUpdate(id) {
      queryName(this.temp).then(res => {
        if (res.code === 200) {
          this.treeData = res.data
          console.log(this.treeData)

          for (var i = 0; i < res.data.length; i++) {
            var a = res.data[i].name
            console.log(a)
          }
        }
      })
      edit({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          editStation(tempData).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: res.msg,
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    handleDelete(id) {
      del({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    hindleChanged(val) {
      console.log(val[0].id)
      this.temp.stationId = val[0].id
      console.log(this.temp.stationId)
    }
  }
}
</script>

<style>
.el-form-item__label {
  width:110px;
}
/* .el-form-item__label */
</style>

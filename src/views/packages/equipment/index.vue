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

      <!-- 设备名称 -->
      <el-table-column :label="$t('table.equipment.name')" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- 型号分类 -->
      <el-table-column :label="$t('table.equipment.modelName')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.modelName }}</span>
        </template>
      </el-table-column>

      <!-- 是否显示 -->
      <el-table-column :label="$t('table.equipment.isShow')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isShow }}</span>
        </template>
      </el-table-column>

      <!-- 计费模式 -->
      <el-table-column :label="$t('table.equipment.billName')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.billName }}</span>
        </template>
      </el-table-column>

      <!-- 滤芯ID -->
      <!-- <el-table-column :label="$t('table.fliterId')" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.fliterId }}</span>
          </template>
        </el-table-column> -->

      <!-- 滤芯组合 -->
      <el-table-column :label="$t('table.equipment.fliterName')" align="center" width="420">
        <template slot-scope="scope">
          <span>{{ scope.row.fliterName }}</span>
        </template>
      </el-table-column>

      <!-- 计费方式 -->
      <!-- <el-table-column :label="$t('table.equipment.billName')" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.billName }}</span>
          </template>
        </el-table-column> -->

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button>
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
            <el-form-item :label="$t('table.equipment.name')">
              <el-input v-model="temp.name" />
            </el-form-item>

            <el-form-item :label="$t('table.equipment.modelName')">
              <el-radio-group v-model="temp.modelType">
                <el-radio v-for="item in modelType" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('table.equipment.isShow')">
              <el-radio-group v-model="temp.isShow">
                <el-radio v-for="item in isShow" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item :label="$t('table.equipment.isPublic')" prop="isPublic">
              <el-radio-group v-model="temp.isPublic">
                <el-radio v-for="item in isPublic" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </div>
          <div style="width:50%;margin-left:10px">
            <!-- <el-form-item :label="$t('table.package.billName')" prop="billName">
              <el-input v-model="temp.billName" />
            </el-form-item> -->

            <el-form-item :label="$t('table.package.billName')" prop="isFirst">
              <el-radio-group v-model="temp.billId" style="font-size:28px;">
                <el-radio v-for="item in billId" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('table.equipment.fliterName')">
              <wlTreeSelect v-model="temp.fliterId" :data="treeData" style="width:177.75px;" checkbox @change="hindleChanged" />
            </el-form-item>

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
import { list, addEquipment, delEquipment, editEqu, queryname, getname, queryEquipByid } from '@/api/equipment'
import Pagination from '@/components/Pagination'
const isShow = [
  { key: '0', display_name: '否' },
  { key: '1', display_name: '是' }
]
const modelType = [
  { key: '0', display_name: 'RO机' },
  { key: '1', display_name: '超滤机' }
]
const billId = [
  { key: '1', display_name: '时长' },
  { key: '2', display_name: '流量' },
  { key: '3', display_name: '套餐' },
  { key: '4', display_name: '零售' }
]

// const modelType = [
//   { key: '1', display_name: 'RO机' },
//   { key: '2', display_name: '超滤芯' }
// ]

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
      modelType,
      isShow,
      billId,
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
        isShow: [{ required: true, message: 'isFirst is required', trigger: 'change' }],
        isPublic: [{ required: true, message: 'isPublic is required', trigger: 'change' }],
        county: [{ required: true, message: 'area is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        waiterPhone: [{ required: true, message: 'service is required', trigger: 'change' }]
      },
      temp: {
        name: '',
        isShow: '',
        fliterId: '',
        billId: '',
        modelType: ''
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
        isShow: '',
        fliterId: '',
        billId: '',
        modelType: ''
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
      this.getList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      getname().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    // 添加确认按钮
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.fliterId = this.temp.fliterId.toString()
          addEquipment(this.temp).then(res => {
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
    // 编辑
    handleUpdate(id) {
      getname().then(res => {
        if (res.code === 200) {
          this.temp = res.data
          console.log(res.data)
        }
      })
      queryEquipByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getList()
          this.resetTemp()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })

      //    getname().then(res => {
      //      if (res.code === 200) {
      //        this.treeData = res.data
      //      }
      //    })
      //  queryEquipByid({ 'id': id }).then(res => {
      //   if (res.code === 200) {
      //      this.getList()
      //   this.resetTemp()
      //   this.temp = Object.assign({}, res.data) // copy obj
      //   this.dialogStatus = 'update'
      //   this.dialogFormVisible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      //   }
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.fliterId = this.temp.fliterIdx.toString()
          const tempData = Object.assign({}, this.temp)
          editEqu(tempData).then(res => {
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
      delEquipment({ 'id': id }).then(res => {
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
      console.log(val)
      var a = []
      for (var i = 0; i < val.length; i++) {
        console.log(val[i].id)
        a.push(val[i].id)
      }
      this.temp.fliterId = a
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

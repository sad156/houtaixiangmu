<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.menuName" :placeholder="$t('table.menu.menuName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.visible" :placeholder="$t('table.menu.visible')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in visible" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
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
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.name')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.icon')" align="center" width="80">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.code')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.component')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.url')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.num')" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.isMenu')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isMenu }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.visible')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.visible }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.menu.perms')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.perms }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
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
            <el-form-item :label="$t('table.menu.menuName')" prop="menuName">
              <el-input v-model="temp.menuName" />
            </el-form-item>
            <el-form-item :label="$t('table.menu.code')" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
            <el-form-item :label="$t('table.menu.num')" prop="orderNum">
              <el-input v-model="temp.orderNum" />
            </el-form-item>
            <el-form-item :label="$t('table.menu.isMenu')" prop="isMenu">
              <el-radio-group v-model="temp.isMenu">
                <el-radio v-for="item in isMenu" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="dialogStatus != 'update'" :label="$t('table.menu.parentId')" prop="pcode">
              <wlTreeSelect
                v-model="temp.pcode"
                :data="treeData"
                @change="hindleChanged"
              />
            </el-form-item>
            <el-form-item v-if="dialogStatus == 'update'" :label="$t('table.remark')">
              <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
            </el-form-item>
          </div>
          <div style="width:50%;margin-left:10px">
            <el-form-item :label="$t('table.menu.address')" prop="url">
              <el-input v-model="temp.url" />
            </el-form-item>
            <el-form-item :label="$t('table.menu.component')" prop="component">
              <el-input v-model="temp.component" />
            </el-form-item>
            <el-form-item :label="$t('table.menu.icon')">
              <el-input v-model="temp.icon" />
            </el-form-item>

            <el-form-item :label="$t('table.menu.visible')" prop="visible">
              <el-radio-group v-model="temp.visible">
                <el-radio v-for="item in visible" :label="item.key">{{ item.display_name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('table.menu.perms')" prop="perms">
              <el-input v-model="temp.perms" />
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
import { list, getAllMenuName, add, queryMenuByid, editMenu, delMenu } from '@/api/menu'
import Pagination from '@/components/Pagination'
const isMenu = [
  { key: '0', display_name: '是' },
  { key: '1', display_name: '否' }
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
      isMenu,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogFormVisible: false,
      rules: {
        menuName: [{ required: true, message: 'menuName is required', trigger: 'change' },
          { min: 3, max: 5, message: 'The length is between 3 and 5 characters', trigger: 'blur' }],
        code: [{ required: true, message: 'code is required', trigger: 'change' }],
        orderNum: [{ required: true, message: 'num is required', trigger: 'change' }],
        isMenu: [{ required: true, message: 'isMenu is required', trigger: 'change' }],
        url: [{ required: true, message: 'url is required', trigger: 'change' }],
        component: [{ required: true, message: 'component is required', trigger: 'change' }],
        visible: [{ required: true, message: 'visible is required', trigger: 'change' }]
      },
      temp: {
        menuName: '',
        isMenu: '1',
        url: '',
        icon: '',
        orderNum: '',
        code: '',
        perms: '',
        visible: '0',
        component: '',
        pcode: '0',
        remark: ''
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
    getAllMenuName() {
      getAllMenuName().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    resetTemp() {
      this.temp = {
        menuName: '',
        isMenu: '1',
        url: '',
        icon: '',
        orderNum: '',
        code: '',
        perms: '',
        visible: '0',
        component: '',
        pcode: '0',
        remark: ''
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 添加
    handleCreate() {
      this.getAllMenuName()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    // 编辑
    handleUpdate(id) {
      queryMenuByid({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getAllMenuName()
          console.log(this.getAllMenuName)
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
          editMenu(tempData).then(res => {
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
      delMenu({ 'id': id }).then(res => {
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
      this.temp.pcode = val[0].code
    }
  }
}
</script>

<style>
</style>

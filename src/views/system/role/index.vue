<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.roleName" :placeholder="$t('table.role.roleName')" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.roleKey" :placeholder="$t('table.role.roleKey')" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.status" :placeholder="$t('table.role.status')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in roleStatus" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listQuery.beginTime"
        type="datetime"
        :placeholder="$t('table.beginTime')"
        placeholder="开始时间"
        style="width: 200px;"
        class="filter-item"
      />
      <el-date-picker
        v-model="listQuery.endTime"
        type="datetime"
        :placeholder="$t('table.endTime')"
        placeholder="结束时间"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.role.roleName')" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.role.roleKey')" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.roleKey }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.role.status')" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.role.createTime')" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row.id)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button size="small" @click="handleAuto(row.id)">
            {{ $t('table.authUser') }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 50%;">
        <el-form-item :label="$t('table.role.roleName')" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item :label="$t('table.role.roleKey')" prop="roleName">
          <el-input v-model="temp.roleKey" />
        </el-form-item>
        <el-form-item :label="$t('table.role.status')">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
          />
        </el-form-item>
        <el-form-item :label="$t('table.role.menuauto')">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="props"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="defCheck"
            :check-strictly="true"
            @check-change="handleCheckChange"
            @check="clickDeal"
          />
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
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

    <el-dialog title="分配用户" :visible.sync="autoVisible">
      <el-checkbox
        v-for="item in user"
        :key="item.id"
        v-model="dataScop.userId"
        :label="item.id"
        border
      >{{ item.account }}</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="autoVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="autoRole()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, delRole, addRole, queryRoleById, editRole, getUserRole, autoUser } from '@/api/role'
import { getAllMenuName } from '@/api/menu'
import { getAllUser } from '@/api/user'
import Pagination from '@/components/Pagination'

const roleStatus = [
  { key: '0', display_name: '正常' },
  { key: '1', display_name: '冻结' }
]

export default {
  components: { Pagination },
  data() {
    return {
      roleStatus,
      total: 0,
      list: null,
      listLoading: true,
      dialogStatus: '',
      autoVisible: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        beginTime: '',
        endTime: '',
        roleName: '',
        roleKey: '',
        status: ''
      },
      temp: {
        roleName: '',
        roleKey: '',
        status: '0',
        remark: '',
        roleMenu: []
      },
      rules: {
        roleName: [{ required: true, message: 'roleName is required', trigger: 'change' }],
        roleKey: [{ required: true, message: 'roleKey is required', trigger: 'change' }]
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      treeData: [],
      props: {
        label: 'name'
      },
      defCheck: [],
      user: [],
      dataScop: {
        userId: [],
        roleId: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        roleName: '',
        roleKey: '',
        status: '0',
        remark: '',
        roleMenu: []
      }
      this.defCheck = []
    },
    handleCreate() {
      this.getAllMenuName()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleMenu = this.temp.roleMenu.join(',')
          addRole(this.temp).then(res => {
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
    handleUpdate(id) {
      queryRoleById({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.getAllMenuName()
          this.temp = Object.assign({}, res.data) // copy obj
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
            this.$refs.tree.setCheckedKeys(res.data.roleMenu)
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleMenu = this.temp.roleMenu.join(',')
          editRole(this.temp).then(res => {
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
      delRole({ 'id': id }).then(res => {
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
    // 获取菜单tree
    getAllMenuName() {
      getAllMenuName().then(res => {
        if (res.code === 200) {
          this.treeData = res.data
        }
      })
    },
    handleAuto(id) {
      this.resdataScop()
      this.getAllUser()
      getUserRole({ 'id': id }).then(res => {
        if (res.code === 200) {
          this.autoVisible = true
          if (res.data) {
            this.dataScop = res.data
          }
          this.dataScop.roleId = id
        }
      })
    },
    resdataScop() {
      this.dataScop = {
        userId: [],
        roleId: ''
      }
    },
    autoRole() {
      this.dataScop.userId = this.dataScop.userId.join(',')
      autoUser(this.dataScop).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.autoVisible = false
        }
      })
    },
    // 获取全部的用户
    getAllUser() {
      getAllUser().then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.user = res.data
          }
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
    handleCheckChange(data, checked, indeterminate) {
      this.temp.roleMenu = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
    },
    clickDeal(currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected)
      for (let i = 0; i < treeList.children.length; i++) {
        this.uniteChildSame(treeList.children[i], isSelected)
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    }
  }
}
</script>

<style>
</style>

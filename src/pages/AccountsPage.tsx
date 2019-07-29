import React, {useState} from 'react'
import {Button, Modal} from 'antd'

import {Spacer, PageHeader} from '@/ui'
import {useEntityPage} from '@/hooks'

import {AccountsTable, AccountForm} from '@/domains/account'

export function AccountsPage() {
  const {entity, modal} = useEntityPage()

  return (
    <div>
      <PageHeader>
        <h1>Счета</h1>
        <Spacer width={20} />
        <Button onClick={modal.show} icon="plus">
          Добавить
        </Button>
      </PageHeader>

      <Modal
        title={`${entity.id ? 'Редактирование' : 'Создание'} счета`}
        visible={modal.visible}
        onCancel={modal.hide}
        footer={null}
        afterClose={entity.clear}
        width={400}
        centered
      >
        <AccountForm onOk={modal.hide} onCancel={modal.hide} accountId={entity.id} />
      </Modal>

      <AccountsTable onRowClick={entity.edit} />
    </div>
  )
}

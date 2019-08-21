import React from 'react'
import {withTypes} from 'react-final-form'
import {Button} from 'antd'

import {ClassifierStub, classifierStore} from '.'
import * as UI from '@/ui'

type Props = {
  onOk: () => any
  onCancel: () => any

  // может быть сюда лучше прокидывать сам объект, а не его id
  // тогда форма не будет ходить в стор
  // с другой стороны, к такой форме легче будет прикрутить урл
  classifierId?: string | null
}

type Values = ClassifierStub & {
  action?: 'create' | 'delete' | 'update'
}

function getInitialValues(classifierId: string | null | undefined): Values {
  if (!classifierId) {
    return {name: ''}
  }

  const classifier = classifierStore.classifierMap[classifierId]
  const {name, namePlural, split, useInTransfer} = classifier

  return {name, namePlural, split, useInTransfer}
}

function validate(values: Partial<Values>) {
  const errors = {} as Record<keyof Values, string>

  if (!values.name) {
    errors.name = 'Обязательное поле'
  }

  return errors
}

export function ClassifierForm(props: Props) {
  const {onOk, onCancel, classifierId} = props
  const initialValues = getInitialValues(classifierId)
  const isNew = !classifierId

  async function onSubmit(values: Values) {
    const {action, ...rest} = values

    if (action === 'delete') {
      await classifierStore.delete(classifierId!)
    } else if (action === 'create') {
      await classifierStore.create(rest)
    } else {
      await classifierStore.update({
        id: classifierId!,
        ...(rest as Required<Values>)
      })
    }

    onOk()
  }

  const {Form} = withTypes<Values>()

  return (
    <Form
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      // todo subscription and FormSpy
      // subscription={{submitting: true}}
      render={({handleSubmit, submitting, form, values}) => (
        <form onSubmit={handleSubmit}>
          <UI.FormRow>
            <UI.FormLabel>Название в единственном числе</UI.FormLabel>
            <UI.FormInput
              name="name"
              placeholder="Название в единственном числе"
              autoComplete="off"
            />
          </UI.FormRow>

          <UI.FormRow>
            <UI.FormLabel>Название во множественном числе</UI.FormLabel>
            <UI.FormInput
              name="namePlural"
              placeholder="Название во множественном числе"
              autoComplete="off"
            />
          </UI.FormRow>

          <UI.FormRow>
            <UI.FormCheckbox name="split">
              Разделять по типу операции
            </UI.FormCheckbox>
          </UI.FormRow>

          <UI.FormRow>
            <UI.FormCheckbox name="useInTransfer">
              Использовать в переводах
            </UI.FormCheckbox>
          </UI.FormRow>

          <UI.Flex justifyContent="space-between">
            <div>
              {!isNew && (
                <Button
                  disabled={submitting}
                  type="danger"
                  htmlType="submit"
                  loading={values.action === 'delete' && submitting}
                  onClick={() => form.change('action', 'delete')}
                >
                  Удалить
                </Button>
              )}
            </div>

            <div>
              <Button onClick={onCancel} disabled={submitting}>
                Отмена
              </Button>

              <UI.Spacer inline width={10} />

              <Button
                type="primary"
                htmlType="submit"
                disabled={submitting}
                loading={values.action !== 'delete' && submitting}
                onClick={() => form.change('action', isNew ? 'create' : 'update')}
              >
                Сохранить
              </Button>
            </div>
          </UI.Flex>
        </form>
      )}
    />
  )
}

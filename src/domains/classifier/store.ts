import { store } from 'react-easy-state'
import nanoid from 'nanoid'

import { arrayToMap } from '@/utils'

import { categoryStore } from '@/domains/category'

import { Classifier, ClassifierStub } from '.'
import * as A from './api'

export const classifierStore = store({
  classifierList: [] as Classifier[],
  classifierMap: {} as Record<string, Classifier>,

  init() {
    return classifierStore._getList()
  },

  async _getList() {
    const list = await A.getList()
    classifierStore.classifierList = list
    classifierStore.classifierMap = arrayToMap(list)
  },

  async create(classifierStub: ClassifierStub) {
    const id = nanoid()
    const { name, namePlural, split, useInTransfer } = classifierStub
    const classifier = {
      id,
      name,
      namePlural: namePlural || name,
      split: !!split,
      useInTransfer: !!useInTransfer
    }

    await A.create(classifier)

    classifierStore.classifierMap[id] = classifier
    classifierStore.classifierList.push(classifier)

    await categoryStore.createClCategory(classifier)
  },

  async update(classifierStub: Required<ClassifierStub> & { id: string }) {
    await A.update(classifierStub)

    const obj = classifierStore.classifierMap[classifierStub.id]
    Object.assign(obj, classifierStub)

    // hacky way to tell subscribed view to re-render
    classifierStore.classifierList = [...classifierStore.classifierList]
  },

  async delete(id: string) {
    await A.deleteClassifier(id)

    const { classifierMap, classifierList } = classifierStore

    setTimeout(() => {
      delete classifierMap[id]
      classifierList.splice(classifierList.findIndex(el => el.id === id), 1)
    }, 0)
  }
})

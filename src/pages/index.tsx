import {setPageMeta} from '@slimr/util'

import {Filler} from '~/layout/filler'
import {Layout} from '~/layout/layout-marketing'

/**
 * A demo of a home page
 */
export default function Index() {
  const {title, description} = setPageMeta({title: 'Home'})
  return (
    <Layout>
      <Layout.Section>
        <h1>{title}</h1>
        <p>{description}</p>
        <Filler />
      </Layout.Section>
    </Layout>
  )
}

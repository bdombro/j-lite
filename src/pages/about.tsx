import {setPageMeta} from '@slimr/util'

import {Filler} from '~/layout/filler'
import {Layout} from '~/layout/layout-marketing'

/**
 * A demo of an about page
 */
export default function About() {
  const {title, description} = setPageMeta({title: 'About'})
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

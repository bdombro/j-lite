import {OnSubmit, SForm, SFormError, useSFormContext} from '@slimr/react'

import {GenericError, InputBox} from '~/foundation'
import {Layout} from '~/layout/layout-login'
import {Logo} from '~/layout/logo'
import {router as r} from '~/router'

/**
 * A demo of a login page
 */
export default function Login() {
  document.title = 'Login'

  const onSubmit: OnSubmit = async (_, vals) => {
    // Tips:
    // 1. useForm already prevents onSubmit from being called
    //    if any inputs have a truthy 'error' property
    // 2. this validation below normally happens on the backend,
    //    but we're doing it here for demo purposes
    const errors: Record<string, string> = {}

    if (vals.email === 'sue@sue.com') {
      errors.email = 'Email is already registered'
    }

    if (Object.keys(errors).length) {
      throw new SFormError(errors)
    }

    console.log('vals', vals)
    r.goto(r.routes.dashboard)
  }

  return (
    <Layout>
      <Layout.Section>
        <div className="login-page">
          <a className="login-page__home" href={r.routes.dashboard.path} title="go home">
            <Logo height={70} _mb={20} />
          </a>
          <SForm className="login-page__form" onSubmit={onSubmit}>
            <InputBox autoFocus label="email" name="email" required type="email" />
            <InputBox label="password" name="password" required type="password" />
            <FormFooter />
            <P className="small login-page__footer">
              Go back to the <a href={r.routes.dashboard.path}>dashboard</a>
            </P>
          </SForm>
        </div>
      </Layout.Section>
    </Layout>
  )
}

const FormFooter = () => {
  const {submitting, accepted, rejected} = useSFormContext()

  return (
    <>
      <GenericError error={rejected && 'Issues found. Please correct and retry.'} />
      <button className="login-page__submit md" type="submit">
        {accepted ? 'Success!' : submitting ? 'Submitting...' : 'Login'}
      </button>
    </>
  )
}

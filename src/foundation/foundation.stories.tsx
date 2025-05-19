import './foundation.stories.pcss'

import {SForm, SFormError, useSFormContext} from '@slimr/react'

import {
  Card,
  GenericError,
  InputBox,
  InputBoxProps,
  RadioBox,
  SelectBox,
  TextareaBox,
  toast,
} from '.'

export const ButtonSizes = () => (
  <>
    <button className="lg" type="button">
      lg
    </button>
    <button className="md" type="button">
      md
    </button>
    <button className="" type="button">
      default
    </button>
  </>
)

export const ButtonTypes = () => (
  <>
    <button className="" type="button">
      default
    </button>
    <button className="secondary" type="button">
      secondary
    </button>
    <button className="tertiary" type="button">
      tertiary
    </button>
  </>
)

export const ButtonGroups = () => (
  <>
    <button className="md left" type="button">
      left
    </button>
    <button className="md middle" type="button">
      middle
    </button>
    <button className="md right" type="button">
      right
    </button>
  </>
)

export const Cards = () => (
  <Card>
    <Div _minW={500}>I'm a box inside a Flex and Card</Div>
    <Div _minW={500}>I'm a box inside a Flex and Card</Div>
  </Card>
)

export const Colors = () => (
  <table className="colors">
    {Colors.names.map(name => (
      <tr key={name}>
        <td style={{backgroundColor: `var(--color-${name})`}} />
        <td>--color-{name}</td>
      </tr>
    ))}
  </table>
)
Colors.names = [
  'primary',
  'primary-darker',
  'secondary',
  'tertiary',
  'success',
  'danger',
  'alert',
  'white',
  'fg',
  'bg',
  'gray1',
  'gray2',
  'gray3',
  'gray4',
  'gray5',
  'gray6',
  'gray7',
  'gray8',
  'gray9',
  'black',
]

function RenderCheck() {
  console.log('render-count:' + ++renderCount)
  return null
}
let renderCount = 0

const FormFooter = () => {
  const {submitting, accepted, rejected} = useSFormContext()

  return (
    <>
      <GenericError error={rejected && 'Issues found. Please correct and retry.'} />
      <button className="left" type="submit">
        {accepted ? 'Success!' : submitting ? 'Submitting...' : 'Submit'}
      </button>
      <button className="tertiary right" disabled={submitting} type="reset">
        Reset
      </button>
      <button
        className="tertiary right"
        onClick={e => {
          const form = e.currentTarget.closest('form') as HTMLFormElement
          const formElements = [...(form.elements as unknown as HTMLInputElement[])].filter(
            e => e.type !== 'reset'
          )
          formElements.forEach(e => (e.disabled = true))
        }}
        type="button"
      >
        Disable
      </button>
    </>
  )
}

const FormInput = ({
  type = 'text',
  ...inputProps
}: Omit<InputBoxProps, 'label' | 'name' | 'ref'>) => {
  return (
    <SForm>
      <InputBox label={type} name="field1" type={type} required {...inputProps} />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

export const FormInputCheckbox = () => <FormInput type="checkbox" />
export const FormInputDate = () => <FormInput type="date" />
export const FormInputNumber = () => <FormInput type="number" />
export const FormInputText = () => (
  <FormInput
    minLength={2}
    maxLength={5}
    type="text"
    validator={str => str === 'na' && '"na" is banned'}
  />
)

export const FormKitchenSink = () => {
  return (
    <SForm onSubmit={(_, vals) => console.log(vals)}>
      {[
        'checkbox',
        'color',
        'date',
        'email',
        'number',
        'password',
        'search',
        'text',
        'textarea',
        'tel',
        'url',
      ].map(type => (
        <InputBox key={type} label={type} name={type} type={type} required />
      ))}
      <RadioBox
        label="Radios"
        name="radio1"
        options={[
          {label: 'Choice 1', value: 'choice1'},
          {label: 'Choice 2', value: 'choice2'},
          {label: 'Choice 3', value: 'choice3'},
        ]}
        required
      />
      <SelectBox
        label={'Select Single'}
        name="select1"
        options={[
          {label: '--', value: ''},
          {label: 'Choice 1', value: 'choice1'},
          {label: 'Choice 2', value: 'choice2'},
          {label: 'Choice 3', value: 'choice3'},
        ]}
        required
      />
      <SelectBox
        label={'Select multiple'}
        multiple
        name="select2"
        options={[
          {label: 'Choice 1', value: 'choice1'},
          {label: 'Choice 2', value: 'choice2'},
          {label: 'Choice 3', value: 'choice3'},
        ]}
        required
      />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

export const FormRadioBox = () => {
  return (
    <SForm>
      <RadioBox
        label="Radios"
        name="radio1"
        options={[
          {label: 'Choice 1', value: 'choice1'},
          {label: 'Choice 2', value: 'choice2'},
          {label: 'Choice 3', value: 'choice3'},
        ]}
        required
      />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

// eslint-disable-next-line react/display-name
const FormSelect = ({multiple}: {multiple: boolean}) => {
  return (
    <SForm>
      <SelectBox
        label={multiple ? 'Select multiple' : 'Select Single'}
        multiple={multiple ? true : undefined}
        name="select1"
        options={[
          ...(multiple ? [] : [{label: '--', value: ''}]),
          {label: 'Choice 1', value: 'choice1'},
          {label: 'Choice 2', value: 'choice2'},
          {label: 'Choice 3', value: 'choice3'},
        ]}
        required
      />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

export const FormSelectSingle = () => <FormSelect multiple={false} />
export const FormSelectMultiple = () => <FormSelect multiple={true} />

export const FormServerError = ({
  type = 'text',
  ...inputProps
}: Omit<InputBoxProps, 'label' | 'name' | 'ref'>) => {
  return (
    <SForm
      onSubmit={(_, vals) => {
        if (vals['field1'] === 'bad') {
          throw new SFormError({
            field1: "'bad' is not allowed",
          })
        }
      }}
    >
      <InputBox label={type} name="field1" type={type} required {...inputProps} />
      <InputBox label={type} name="field2" type={type} required {...inputProps} />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

export const FormTextareaBox = () => {
  return (
    <SForm>
      <TextareaBox label="Textarea" name="field1" required />
      <FormFooter />
      <RenderCheck />
    </SForm>
  )
}

export const Icons = () => (
  <div className="icons">
    {Object.keys(icons).map((name, i) => (
      <div key={i}>
        <Icon name={name as unknown as IconKeys} />
        <p>{name}</p>
      </div>
    ))}
  </div>
)

export const Toasts = () => {
  return (
    <>
      <button type="button" onClick={() => toast({key: 'i', message: 'info', variant: 'info'})}>
        info
      </button>
      <button
        type="button"
        onClick={() => toast({key: 's', message: 'success', variant: 'success'})}
      >
        success
      </button>
      <button type="button" onClick={() => toast({key: 'a', message: 'alert', variant: 'alert'})}>
        alert
      </button>
      <button type="button" onClick={() => toast({key: 'e', message: 'error', variant: 'error'})}>
        error
      </button>
      <button
        type="button"
        onClick={() => toast({key: 'c', message: 'center placement', placement: 'center'})}
      >
        center
      </button>
      <button
        type="button"
        onClick={() => toast({key: 'b', message: 'bottom placement', placement: 'bottom'})}
      >
        bottom
      </button>
      <button type="button" onClick={() => toast({key: 'r', message: 'right placement'})}>
        right
      </button>
      <button type="button" onClick={() => toast({key: 'r2', message: 'right placement again'})}>
        right2
      </button>
      <button type="button" onClick={() => toast({message: 'no icon', icon: null})}>
        no icon
      </button>
      <button
        type="button"
        onClick={() =>
          toast({key: 's1', duration: Infinity, message: 'sticky1', placement: 'bottom'})
        }
      >
        sticky bottom
      </button>
      <button
        type="button"
        onClick={() =>
          toast({key: 's2', duration: Infinity, message: 'sticky2', variant: 'success'})
        }
      >
        sticky success
      </button>
      <button
        type="button"
        onClick={() => toast({duration: Infinity, dismissable: false, message: 'non-dismissable'})}
      >
        non-dismissable
      </button>
      <button type="button" onClick={() => throwError('This is an error')}>
        throw error
      </button>
      <button type="button" onClick={async () => throwError('This is an async error')}>
        throw async error
      </button>
    </>
  )
}

export const Typography = () => (
  <div className="typography">
    <h1>h1</h1>
    <h2>h2</h2>
    <h3>h3</h3>
    <h4>h4</h4>
    <h5>h5</h5>
    <h6>h6</h6>
    <p>p</p>
    <small>small</small>
    <p className="small">small class</p>
    <p className="tiny">tiny</p>
  </div>
)

export default {
  title: 'Foundation/stories',
  // tags: ['autodocs'],
  component: ButtonSizes,
}

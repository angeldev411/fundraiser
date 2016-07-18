const ANONYMOUS = '<<anonymous>>'

/**
 * Creates a proptype checker that can be chained to a `.isRequired` prop
 * Pulled from react source repo and localized via https://github.com/insin/chainable-check
 */
export function createChainableTypeChecker(validate) {
  function check(isRequired, props, propName, componentName, location) {
    componentName = componentName || ANONYMOUS
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required ${location} \`${propName}\` was not specified in ` +
          `\`${componentName}\`.`
        )
      }
    }
    else {
      return validate(props, propName, componentName, location)
    }
  }

  var chainedCheck = check.bind(null, false)
  chainedCheck.isRequired = check.bind(null, true)

  return chainedCheck
}

/***
 * Date type for use as PropType
 * @example
 *  static propTypes = {
 *    someData: dateType.isRequired,
 *  }
 */
export const dateType = createChainableTypeChecker((props, propName, componentName) => {
  let ret
  if(Object.prototype.toString.call(props[propName]) !== '[object Date]') {
    ret = new Error(`"${props[propName]}" (${(typeof props[propName])}) passed\
                    to "${componentName}" as prop "${propName}" is not a valid date object.`)
  }
  return ret
})


import {
  createUseThemeProps
} from "./chunk-27ROQ3U3.js";
import {
  styled_default
} from "./chunk-RVC37N35.js";
import {
  _objectWithoutPropertiesLoose,
  clsx_default,
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  init_clsx,
  init_composeClasses,
  init_generateUtilityClass,
  init_generateUtilityClasses,
  init_objectWithoutPropertiesLoose,
  require_jsx_runtime,
  require_prop_types
} from "./chunk-QRM5AAZK.js";
import {
  require_react
} from "./chunk-2PA4WPI3.js";
import {
  _extends,
  init_extends
} from "./chunk-BJM7UO3E.js";
import {
  __toESM
} from "./chunk-ROME4SDB.js";

// node_modules/@mui/material/AccordionDetails/AccordionDetails.js
init_extends();
init_objectWithoutPropertiesLoose();
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
init_clsx();
init_composeClasses();

// node_modules/@mui/material/AccordionDetails/accordionDetailsClasses.js
init_generateUtilityClasses();
init_generateUtilityClass();
function getAccordionDetailsUtilityClass(slot) {
  return generateUtilityClass("MuiAccordionDetails", slot);
}
var accordionDetailsClasses = generateUtilityClasses("MuiAccordionDetails", ["root"]);
var accordionDetailsClasses_default = accordionDetailsClasses;

// node_modules/@mui/material/AccordionDetails/AccordionDetails.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var _excluded = ["className"];
var useThemeProps = createUseThemeProps("MuiAccordionDetails");
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getAccordionDetailsUtilityClass, classes);
};
var AccordionDetailsRoot = styled_default("div", {
  name: "MuiAccordionDetails",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})(({
  theme
}) => ({
  padding: theme.spacing(1, 2, 2)
}));
var AccordionDetails = React.forwardRef(function AccordionDetails2(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: "MuiAccordionDetails"
  });
  const {
    className
  } = props, other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = props;
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsx)(AccordionDetailsRoot, _extends({
    className: clsx_default(classes.root, className),
    ref,
    ownerState
  }, other));
});
true ? AccordionDetails.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var AccordionDetails_default = AccordionDetails;

export {
  getAccordionDetailsUtilityClass,
  accordionDetailsClasses_default,
  AccordionDetails_default
};
//# sourceMappingURL=chunk-QVMGOKT4.js.map

/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    return (
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </CenteredSection>
          <Section>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <AtPrefix>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </AtPrefix>
                <Input
                  id="username"
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={this.props.onChangeUsername}
                />
              </label>
            </Form>
            <ReposList {...reposListProps} />
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);

// @flow

// import React from 'react'
// import {
//   View,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   Image,
//   Modal,
//   Alert
// } from 'react-native'
// import { connect } from 'react-redux'
// import Styles from './Styles/SignupScreenStyle'
// import {Images, Metrics, Colors} from '../Themes'
// import LoginActions, { loggedInUser } from '../Redux/LoginRedux'
// import { Actions as NavigationActions } from 'react-native-router-flux'
// import I18n from 'react-native-i18n'
// import Icon from 'react-native-vector-icons/Ionicons'
// import { Hideo} from 'react-native-textinput-effects';
// import Divider from '../Components/Divider';
// import FullButton from '../Components/FullButton';
// import DatePicker from 'react-native-datepicker'
// import Moment from 'moment';
// import Picker from 'react-native-picker';
// import ImagePicker from 'react-native-image-picker';
// import AlertBox from '../Components/AlertBox';
// import Validator from 'validator';
// import _ from 'lodash';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Loader from '../Components/Loader';
// import dismissKeyboard from 'react-native-dismiss-keyboard';
// import Permissions from 'react-native-permissions';

// type SignupScreenProps = {
//   dispatch: () => any,
//   fetching: boolean,
//   attemptSignup: () => void,
// }

// class SignupScreen extends React.Component {

//   props: SignupScreenProps

//   state: {
//     signedup : boolean,
//     gender : string,
//     birthday: string,
//     name: string,
//     email: string,
//     password: string,
//     avatar: object,
//     loading: boolean,
//     validForm: boolean,
//     errors: object,
//     FormErrorFlag: boolean,
//     FormError: string,
//     displayDate: string,
//     cameraPermission: string,
//     termsModal : boolean
//   }

//   isAttempting: boolean

//   constructor (props: SignupScreenProps) {
//     super(props)
//     this.isAttempting = false,
//     this.state = {
//       signedup: false,
//       gender: 'Gender',
//       birthday: 'Birthday',
//       name: '',
//       email: '',
//       password: '',
//       avatar: {source: '', type: '', name: ''},
//       loading: false,
//       validForm: true,
//       errors: {
//         name: [],
//         email: [],
//         gender: [],
//         birthday: [],
//         password: [],
//         avatar: []
//       },
//       FormErrorFlag: false,
//       FormError: '',
//       displayDate: 'Birthday',
//       cameraPermission: '',
//       termsModal: false
//     }
//   }

//   _alertForPermission(permission, message) {
//     Alert.alert(
//       'Can we access your ' + permission + '?',
//       message,
//       [
//         {text: 'No way', onPress: () => {}},
//         {text: 'Open Settings', onPress: Permissions.openSettings}
//       ]
//     )
//   }

//   _requestPermission(permissionArray) {

//     _.forEach(permissionArray, (value, key) => {

//       Permissions.requestPermission(value)
//         .then(response => {
//           //returns once the user has chosen to 'allow' or to 'not allow' access
//           //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
//           switch(value){
//             case 'location':
//               this.setState({ locationPermission: response });
//               break;
//             case 'photo' :
//               this.setState({ photoPermission: response });
//               break;
//             case 'camera' :
//               this.setState({ cameraPermission: response });
//               break;
//           }
//         });

//     });

//     this.openImagePicker();
//   }

//   _checkPermission (permissionArray, callback) {
//     Permissions.checkMultiplePermissions(permissionArray)
//       .then(response => {
//         //response is an object mapping type to permission
//         this.setState({
//           cameraPermission: response.camera,
//           photoPermission: response.photo,
//           locationPermission: response.location
//         });

//         return callback();
//       });
//   }

//   componentWillReceiveProps (newProps) {
//     this.forceUpdate()
//     // Did the login attempt complete?
//     if (this.isAttempting && !newProps.fetching) {
//       this.setState({loading: false});
//       if(newProps.error == null){
//         NavigationActions.presentationScreen({type:' '})
//       }else{
//         this.setState({FormErrorFlag: true, FormError: newProps.error});
//       }
//     }
//   }

//   componentDidMount () {
//     this._checkPermission(['camera'], () => {})
//   }

//   /*componentWillUnmount () {
//    this.keyboardDidShowListener.remove()
//    this.keyboardDidHideListener.remove()
//    }*/

//   handlePressSignup = () => {
//     this.setState({loading: true});
//     const { name, email, birthday, gender, avatar, password, validForm, errors } = this.state

//     let isValidForm = this.validateForm(this.state);
//     if(!isValidForm)
//       this.setState({loading: false});

//     if(isValidForm){
//       this.isAttempting = true;
//       dismissKeyboard();

//       let genderVariable = gender
//       if(genderVariable === 'Gender')
//         genderVariable = 'other';
//       this.props.attemptSignup(name, email, birthday, genderVariable, avatar, password);
//     }

//   }

//   handleChangeName = (text) => {
//     this.setState({ name: text })
//   }

//   handleChangePassword = (text) => {
//     this.setState({ password: text })
//   }

//   handleChangeEmail = (text) => {
//     this.setState({ email: text })
//   }

//   openImagePicker = () => {
//     this._checkPermission(['camera'], () => {
//       if(this.state.cameraPermission === 'authorized'){
//         this.capturePic()
//       }
//       else if(this.state.cameraPermission === 'denied'){
//         this._alertForPermission('camera', 'Access to your camera will help us to capture a picture');
//       }
//       else if(this.state.locationPermission === 'undetermined' || this.state.cameraPermission === 'undetermined' || this.state.photoPermission === 'undetermined'){
//         this._requestPermission(['camera']);
//       }

//     })
//   }

//   capturePic = () => {
//     // More info on all the options is below in the README...just some common use cases shown here
//     var options = {
//       title: 'Select Avatar',
//       noData: true,
//       maxWidth:1200,
//       quality: 0.6,
//       showsCameraControls: true,
//       mediaType: 'photo',
//       storageOptions: {
//         skipBackup: true,
//         path: 'images'
//       }
//     };

//     /**
//      * The first arg is the options object for customization (it can also be null or omitted for default options),
//      * The second arg is the callback which sends object: response (more info below in README)
//      */
//     ImagePicker.showImagePicker(options, (response) => {
//       if (!response.didCancel && !response.error) {
//         this.setState({
//           avatar: {
//             source: response.uri,
//             type: 'image/' + _.last(response.uri.split('.')),
//             name: Math.random() + '.' +  _.last(response.uri.split('.'))
//           }
//         });
//       }
//     });
//   }

//   onPressPicker = () => {

//     let data = ['Male', 'Female'];
//     Picker.init({
//       pickerData: data,
//       selectedValue: ['Male'],
//       pickerConfirmBtnText: 'Confirm',
//       pickerCancelBtnText: 'Cancel',
//       pickerTitleText: 'Select Gender',
//       onPickerConfirm: data => {
//         this.setState({gender: data[0]});
//       },
//     });
//     Picker.show();

//   }

//   validateForm = (state) => {

//     const { name, email, password, birthday, gender, avatar} = state

//     let validity = true;

//     let errors = {
//       name: [],
//       email: [],
//       gender: [],
//       birthday: [],
//       password: [],
//       avatar: []
//     };

//     this.setState({errors:errors, validForm: true, FormErrorFlag: false, FormError: ""});

//     //validating form
//     if(Validator.isEmpty(name)){
//       validity = false;
//       errors.name.push("Name is required");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Name is required",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     if(Validator.isEmpty(email)){
//       validity = false;
//       errors.email.push("Email is required");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Email is required",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     if(!Validator.isEmail(email)){
//       validity = false;
//       errors.email.push("Email should be valid email address");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Email should be valid email address",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     if(Validator.isEmpty(password)){
//       validity = false;
//       errors.password.push("Password is required");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Password is required",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     if(password.length < 6){
//       validity = false;
//       errors.password.push("Password should be at least six characters");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Password should be at least six characters",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     if(birthday == 'Birthday'){
//       validity = false;
//       errors.birthday.push("Birthday is required");

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Birthday is required",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }



//     if(Validator.isEmpty(avatar.source)){
//       validity = false;

//       this.setState({
//         FormErrorFlag: true,
//         FormError: "Profile picture is required",
//         validForm: validity,
//         errors: errors
//       });
//       return validity;
//     }

//     //this.setState({validForm: validity, errors: errors});

//     return validity;

//   }

//   closeFormErrorModal = () => {
//     this.setState({ FormErrorFlag: false });
//   }

//   closeModal = () => {
//     this.setState({
//       termsModal: false
//     })
//   }

//   renderTermsModal = () => {

//     return (
//       <Modal
//         animationType={'slide'}
//         transparent={true}
//         visible={this.state.termsModal}
//         onRequestClose={()=>this.closeModal}
//       >
//         <ScrollView style={ Styles.modalView } contentContainerStyle={Styles.modalViewScroll} keyboardShouldPersistTaps={true}>
//           <View style={Styles.modalInternal}>
//             <View style={Styles.modalHeader}>
//               <Text style={Styles.termsHeaderTitleText}>Terms & Conditions</Text>
//             </View>
//             <View>
//               <Text style={Styles.paragraph}>These Terms of Use are Effective May 30th 2017 </Text>
//               <Text style={Styles.paragraph}>By accessing or using the NyteVibe mobile application made available by Eye House Media, LLC (together, the "Service"), however accessed, you agree to be bound by these terms of use ("Terms of Use"). The Service is owned or controlled by Eye House Media, LLC ("NyteVibe"). These Terms of Use affect your legal rights and obligations. If you do not agree to be bound by all of these Terms of Use, do not access or use the Service.</Text>
//               <Text style={Styles.paragraph}>If NyteVibe offers an additional or special service that would affect change to the Terms of Use, the user will receive a notification within 30 days and/or this section will be amended to reflect such changes, made noticeable by the Terms of Use Effective date located above.</Text>
//               <Text style={Styles.paragraph}>ARBITRATION NOTICE: EXCEPT IF YOU OPT-OUT AND EXCEPT FOR CERTAIN TYPES OF DISPUTES DESCRIBED IN THE ARBITRATION SECTION BELOW, YOU AGREE THAT DISPUTES BETWEEN YOU AND NyteVibe WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION AND YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.</Text>

//               <Text style={Styles.heading}>Basic Terms</Text>
//               <Text style={Styles.paragraph}>1. You must be at least 18 years old to use the Service.</Text>
//               <Text style={Styles.paragraph}>2. NyteVibe strongly discourages posting any violent, discriminatory, hateful, infringing, or unlawful content via the Service, as well as any graphic sexual content including nudity. NyteVibe discourages content encouraging drinking alcohol or the use of illegal drugs, and will remove any content encouraging alcohol or drug consumption to minors. Violation of these terms can result in the termination of your account as determined by NyteVibe.</Text>
//               <Text style={Styles.paragraph}>3. You are responsible for any activity that occurs through your account. With the exception of people or businesses that are expressly authorized to create accounts on behalf of their employers or clients, or in the instance that you log in as an â€œAnonymousâ€ user, NyteVibe prohibits the creation of and you agree that you will not create an account for anyone other than yourself.</Text>
//               <Text style={Styles.paragraph}>4. You agree that you will not solicit, collect or use the login credentials of other NyteVibe users.</Text>
//               <Text style={Styles.paragraph}>5. You are responsible for keeping your password and account information secret and secure.</Text>
//               <Text style={Styles.paragraph}>6. You must not stalk, bully, harass, or threaten individuals. You must not post any private or personal information about another user, such as a person's credit card information, social security or alternate national identity numbers, non-public phone numbers or non-public email addresses.</Text>
//               <Text style={Styles.paragraph}>7. You may not use the Service for any illegal or unauthorized purpose. You agree to comply with all laws, rules and regulations (for example, federal, state, local and provincial) applicable to your use of the Service and your Content (defined below), including but not limited to, copyright laws.</Text>
//               <Text style={Styles.paragraph}>8. You are solely responsible for your conduct and any data, text, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials (collectively, "Content") that you submit, post or display on or via the Service.</Text>
//               <Text style={Styles.paragraph}>9. You must not change, modify, or alter the Service or change, modify or alter another website so as to falsely imply that it is associated with the Service or NyteVibe.</Text>
//               <Text style={Styles.paragraph}>10. You must not interfere or disrupt the Service or servers or networks connected to the Service, including by transmitting any worms, viruses, spyware, malware or any other code of a destructive or disruptive nature. You may not inject content or code or otherwise alter or interfere with the way any NyteVibe page is rendered or displayed in a user's browser or device.</Text>
//               <Text style={Styles.paragraph}>11. You must not create accounts with the Service through unauthorized means, including but not limited to, by using an automated device, script, bot, spider, crawler or scraper.</Text>
//               <Text style={Styles.paragraph}>12. Violation of these Terms of Use may, in NyteVibe's sole discretion, result in termination of your NyteVibe account. You understand and agree that NyteVibe cannot and will not be responsible for the Content posted on the Service and you use the Service at your own risk. If you violate these Terms of Use, or otherwise create risk or possible legal exposure for NyteVibe, we can stop providing all or part of the Service to you.</Text>

//               <Text style={Styles.heading}>Conditions</Text>
//               <Text style={Styles.paragraph}>1. You have the free will to use the Service under these expressed Terms and Conditions. If you do not agree by these terms, you have the ability to delete your account at any time under the Settings tab in the side menu of the mobile application. Upon termination, all licenses and other rights granted to you in these Terms of Use will immediately cease.</Text>
//               <Text style={Styles.paragraph}>2. We reserve the right to refuse access to the Service to anyone for any reason at any time.</Text>
//               <Text style={Styles.paragraph}>3. We reserve the right to force forfeiture of any username for any reason.</Text>
//               <Text style={Styles.paragraph}>4. You are solely responsible for your interaction with other users of the Service, whether online or offline. You agree that NyteVibe is not responsible or liable for the conduct of any user. Exercise common sense and your best judgment when interacting with others, including when you post Content, engage with friends, or any personal or other information.</Text>
//               <Text style={Styles.paragraph}>5. NyteVibe includes links to third-party web sites or features, such as Facebook, Twitter, and Instagram. There may also be links to third-party web sites or features in images or comments within the Service. The Service also includes third-party content that we do not control, maintain or endorse. Functionality on the Service may also permit interactions between the Service and a third-party web site or feature, including applications that connect the Service or your profile on the Service with a third-party web site or feature. For example, the Service may include a feature that enables you to share Content from the Service or your Content with a third party, which may be publicly posted on that third party's service or application. Using this functionality typically requires you to login to your account on the third-party service and you do so at your own risk. Your correspondence and business dealings with third parties found through the service are solely between you and the third party.</Text>

//               <Text style={Styles.heading}>Rights</Text>
//               <Text style={Styles.paragraph}>1. NyteVibe does not claim ownership of any Content that you post on or through the Service. Instead, you hereby grant to NyteVibe a non-exclusive, fully paid and royalty-free, transferable, sub-licensable, worldwide license to use the Content that you post on or through the Service, subject to the Service's Privacy Policy.</Text>
//               <Text style={Styles.paragraph}>2. You acknowledge that we may not always identify paid services, sponsored content, or commercial communications as such.</Text>
//               <Text style={Styles.paragraph}>3. The NyteVibe name and logo are trademarks of Eye House Media, LLC, and may not be copied, imitated or used, in whole or in part, without the prior written permission of NyteVibe. In addition, all page headers, custom graphics, button icons and scripts are service marks, trademarks and/or trade dress of NyteVibe, and may not be copied, imitated or used, in whole or in part, without prior written permission from NyteVibe.</Text>
//               <Text style={Styles.paragraph}>4. Although it is NyteVibe's intention for the Service to be available as much as possible, there will be occasions when the Service may be interrupted, including, without limitation, for scheduled maintenance or upgrades, for emergency repairs, or due to failure of telecommunications links and/or equipment. NyteVibe reserves the right to remove any Content from the Service for any reason, without prior notice.</Text>
//               <Text style={Styles.paragraph}>5. You agree that NyteVibe is not responsible for, and does not endorse, Content posted within the Service. NyteVibe does not have any obligation to prescreen, monitor, or edit any Content beyond what is required by Apple, Inc. If your Content violates these Terms of Use, you may bear legal responsibility for that Content.</Text>

//               <Text style={Styles.heading}>Limitation of Liability; Waiver</Text>
//               <Text style={Styles.paragraph}>UNDER NO CIRCUMSTANCES WILL THE NyteVibe PARTIES BE LIABLE TO YOU FOR ANY LOSS OR DAMAGES OF ANY KIND (INCLUDING, WITHOUT LIMITATION, FOR ANY DIRECT, INDIRECT, ECONOMIC, EXEMPLARY, SPECIAL, PUNITIVE, INCIDENTAL OR CONSEQUENTIAL LOSSES OR DAMAGES) THAT ARE DIRECTLY OR INDIRECTLY RELATED TO: (A) THE SERVICE; (B) THE NyteVibe CONTENT; (C) USER CONTENT; (D) YOUR USE OF, INABILITY TO USE, OR THE PERFORMANCE OF THE SERVICE; (E) ANY ACTION TAKEN IN CONNECTION WITH AN INVESTIGATION BY THE NyteVibe PARTIES OR LAW ENFORCEMENT AUTHORITIES REGARDING YOUR OR ANY OTHER PARTY'S USE OF THE SERVICE; (F) ANY ACTION TAKEN IN CONNECTION WITH COPYRIGHT OR OTHER INTELLECTUAL PROPERTY OWNERS; (G) ANY ERRORS OR OMISSIONS IN THE SERVICE'S OPERATION; OR (H) ANY DAMAGE TO ANY USER'S MOBILE DEVICE, OR OTHER EQUIPMENT OR TECHNOLOGY INCLUDING, WITHOUT LIMITATION, DAMAGE FROM ANY SECURITY BREACH OR FROM ANY VIRUS, BUGS, TAMPERING, FRAUD, ERROR, OMISSION, INTERRUPTION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER LINE OR NETWORK FAILURE OR ANY OTHER TECHNICAL OR OTHER MALFUNCTION, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOST PROFITS, LOSS OF GOODWILL, LOSS OF DATA, WORK STOPPAGE, ACCURACY OF RESULTS, OR COMPUTER FAILURE OR MALFUNCTION, EVEN IF FORESEEABLE OR EVEN IF THE NyteVibe PARTIES HAVE BEEN ADVISED OF OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, STRICT LIABILITY OR TORT (INCLUDING, WITHOUT LIMITATION, WHETHER CAUSED IN WHOLE OR IN PART BY NEGLIGENCE, ACTS OF GOD, TELECOMMUNICATIONS FAILURE, OR THEFT OR DESTRUCTION OF THE SERVICE). IN NO EVENT WILL THE NyteVibe PARTIES BE LIABLE TO YOU OR ANYONE ELSE FOR LOSS, DAMAGE OR INJURY, INCLUDING, WITHOUT LIMITATION, DEATH OR PERSONAL INJURY. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU. IN NO EVENT WILL THE NyteVibe PARTIES TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES OR CAUSES OR ACTION EXCEED THIRTY DOLLARS ($30) OR ONE MONTH SUBSCRIPTION REFUND.</Text>
//               <Text style={Styles.paragraph}>YOU AGREE THAT IN THE EVENT YOU INCUR ANY DAMAGES, LOSSES OR INJURIES THAT ARISE OUT OF NyteVibe'S ACTS OR OMISSIONS, THE DAMAGES, IF ANY, CAUSED TO YOU ARE NOT IRREPARABLE OR SUFFICIENT TO ENTITLE YOU TO AN INJUNCTION PREVENTING ANY EXPLOITATION OF ANY WEB SITE, SERVICE, PROPERTY, PRODUCT OR OTHER CONTENT OWNED OR CONTROLLED BY THE NyteVibe PARTIES, AND YOU WILL HAVE NO RIGHTS TO ENJOIN OR RESTRAIN THE DEVELOPMENT, PRODUCTION, DISTRIBUTION, ADVERTISING, EXHIBITION OR EXPLOITATION OF ANY WEBSITE, PROPERTY, PRODUCT, SERVICE, OR OTHER CONTENT OWNED OR CONTROLLED BY THE NyteVibe PARTIES.</Text>
//               <Text style={Styles.paragraph}>BY ACCESSING THE SERVICE, YOU UNDERSTAND THAT YOU MAY BE WAIVING RIGHTS WITH RESPECT TO CLAIMS THAT ARE AT THIS TIME UNKNOWN OR UNSUSPECTED, AND IN ACCORDANCE WITH SUCH WAIVER, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND, AND HEREBY EXPRESSLY WAIVE, THE BENEFITS OF SECTION 1542 OF THE CIVIL CODE OF CALIFORNIA, AND ANY SIMILAR LAW OF ANY STATE OR TERRITORY, WHICH PROVIDES AS FOLLOWS: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE DEBTOR."</Text>
//               <Text style={Styles.paragraph}>NyteVibe IS NOT RESPONSIBLE FOR THE ACTIONS, CONTENT, INFORMATION, OR DATA OF THIRD PARTIES, AND YOU RELEASE US, OUR DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS FROM ANY CLAIMS AND DAMAGES, KNOWN AND UNKNOWN, ARISING OUT OF OR IN ANY WAY CONNECTED WITH ANY CLAIM YOU HAVE AGAINST ANY SUCH THIRD PARTIES.</Text>

//               <Text style={Styles.heading}>Indemnification</Text>
//               <Text style={Styles.paragraph}>You (and also any third party for whom you operate an account or activity on the Service) agree to defend (at NyteVibe's request), indemnify and hold the NyteVibe Parties harmless from and against any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable attorney's fees and costs, arising out of or in any way connected with any of the following (including as a result of your direct activities on the Service or those conducted on your behalf): (i) your Content or your access to or use of the Service; (ii) your breach or alleged breach of these Terms of Use; (iii) your violation of any third-party right, including without limitation, any intellectual property right, publicity, confidentiality, property or privacy right; (iv) your violation of any laws, rules, regulations, codes, statutes, ordinances or orders of any governmental and quasi-governmental authorities, including, without limitation, all regulatory, administrative and legislative authorities; or (v) any misrepresentation made by you. You will cooperate as fully required by NyteVibe in the defense of any claim. NyteVibe reserves the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you will not in any event settle any claim without the prior written consent of NyteVibe.</Text>

//               <Text style={Styles.heading}>NyteVibe iOS/Android Application End User License Addendum</Text>
//               <Text style={Styles.paragraph}>Last Updated: May 30th 2017</Text>
//               <Text style={Styles.paragraph}>This NyteVibe Application End User License Addendum ("Mobile Addendum") is between you and Eye House Media, LLC, LLC ("NyteVibe") and governs your use of Eye House Media, LLC, LLCâ€™s mobile applications for iOS including NyteVibe. This Mobile Addendum is an addendum to NyteVibeâ€™s Terms and Conditions (http://NyteVibe.com/terms_and_conditions).</Text>
//               <Text style={Styles.paragraph}>1. Parties. This Mobile Addendum is between you and NyteVibe only, and not Apple or Google, Inc. ("Apple"). Eye House Media, LLC, LLC, not Apple or Google, is solely responsible for the NyteVibe content. Although Apple is not a party to this Mobile Addendum, Apple has the right to enforce this Mobile Addendum against you as a third party beneficiary relating to your use of the NyteVibe Application.</Text>
//               <Text style={Styles.paragraph}>2. Terms of Service. By agreeing to this License, You are also agreeing to the Terms of Service for use of the NyteVibe Application. Any violation of this License or the NyteVibe Terms and Conditions submitted as a â€œReportâ€ from within the Application will result in an investigation by NyteVibe and subsequent action as determined by the company will be taken within 24 hours.</Text>
//               <Text style={Styles.paragraph}>3. Privacy. NyteVibe may collect and use information concerning your use of the NyteVibe as set forth in its Privacy Policy (http://NyteVibe.com/privacy_policy).</Text>
//               <Text style={Styles.paragraph}>4. Limited License. NyteVibe grants you a limited, non-exclusive, non-transferrable, revocable license to use the NyteVibe iOS Application for your personal, non-commercial purposes. You may only use the NyteVibe Application on an iPhone, iPod Touch, iPad, or other Apple device that you own or control and as permitted by the Apple App Store Terms of Service.</Text>
//               <Text style={Styles.paragraph}>5. Restrictions. You agree to, and you will not permit others to license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose, or otherwise commercially exploit the NyteVibe Application or make the Application available to any third party. You shall use the Application strictly in accordance with the NyteVibe Terms and Conditions and Privacy Policy, and shall not (I) decompile, reverse-engineer, disassemble attempt to derive the source code of, or decrypt the Application; (II) violate any applicable laws, rules or regulations in connection with Your access or use of the Application; (III) make any modification, adaptation, enhancement, translation, or derivative work from the Application; (IV) remove, alter, or obscure any proprietary notice (including any notice of copyright or trademark) of NyteVibe and its affiliates; (V) Use the Application for creating a product, service or software that is directly or indirectly competitive with or in any way a substitute for any services, products or software offered by NyteVibe.</Text>
//               <Text style={Styles.paragraph}>6. Termination. NyteVibe may, in its sole an absolute discretion, at any time and for no reason, suspend or terminate this License and the rights afforded to You hereunder with or without prior notice. Furthermore, if you fail to comply with any terms and conditions of this License, then this License and any rights afforded to You hereunder shall terminate automatically, without any notice or other action by Eye House Media, LLC, LLC. Upon termination of this License, You shall cease all use of the Application and uninstall the Application.</Text>
//               <Text style={Styles.paragraph}>7. Disclaimer of Warranties. The NyteVibe Application is provided for free on an "as is" basis, and that your use or reliance upon the Application and any third party content and services accessed thereby is at your sole risk and discretion. As such, NyteVibe disclaims all warranties about the Eye House Media, LLC applications to the fullest extent permitted by law. To the extent any warranty exists under law that cannot be disclaimed, Eye House Media, LLC, not Apple or Google, shall be solely responsible for such warranty. NyteVibe and its affiliates, partners, suppliers and licensors make no warranty that (I) the application or third party content and services will meet your requirements; (II) the application or third party content and services will be uninterrupted, accurate, reliable, timely, secure, or error-free; (III) The quality of any products, services, information, or other material accessed or obtained by you through the Application will be as represented or meet your expectations; or (IV) Any errors in the application or third party content and services will be corrected.</Text>
//               <Text style={Styles.paragraph}>8. Maintenance and Support. Because NyteVibe is free to download and use, NyteVibe does not provide any maintenance or support for the Application. To the extent that any maintenance or support is required by applicable law, Eye House Media, LLC, not Apple or Google, shall be obligated to furnish any such maintenance or support.</Text>
//               <Text style={Styles.paragraph}>9. Third Party Intellectual Property Claims. NyteVibe shall not be obligated to indemnify or defend you with respect to any third party claim arising out or relating to the NyteVibe Application. To the extent NyteVibe is required to provide indemnification by applicable law, Eye House Media, LLC, not Apple or Google, shall be solely responsible for the investigation, defense, settlement and discharge of any claim that the NyteVibe Application or your use of it infringes any third party intellectual property right.</Text>
//               <Text style={Styles.paragraph}>10. Product Claims. To the extent you have any claim arising from or relating to your use of the NyteVibe, Eye House Media, LLC, not Apple or Google, is responsible for addressing any such claims, which may include, but are not limited to: (i) any product liability claim; (ii) any claim that the NyteVibe Application fails to conform to any applicable legal or regulatory requirement; and (iii) any claim arising under consumer protection or similar legislation. Nothing in this Mobile Addendum shall be deemed an admission that you may have such claims.</Text>
//               <Text style={Styles.paragraph}>11. U.S. Legal Compliance. You represent and warrant that (i) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a "terrorist supporting" country; and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties.</Text>
//               <Text style={Styles.paragraph}>12. Contact Information. Should you have any questions, complaints, or claims relating to the NyteVibe Application, please contact us at support@NyteVibe.com or visit our website for more information at www.NyteVibe.com.</Text>
//               <View style={Styles.modalViewScroll}>
//                 <FullButton text="Accept" onPress={() => this.closeModal()} textStyle={Styles.buttonTextAccept} styles={Styles.buttonAccept}/>
//               </View>
//             </View>
//           </View>
//         </ScrollView>

//       </Modal>
//     )
//   }

//   render () {

//     let avatarView = '';
//     if(this.state.avatar.source == ''){
//       avatarView = <Icon name="ios-camera-outline" style={Styles.uploadIcon}/>;
//     }else {
//       avatarView = <Image source={{uri: this.state.avatar.source}} style={Styles.uploadImage} />;
//     }

//     return (


//         <View style={[Styles.mainView, {height: Metrics.screenHeight, width: Metrics.screenWidth}]}>

//           <View style={Styles.backgroundImageContainer}>
//             <Image source={Images.background} style={Styles.backgroundImage}/>
//           </View>

//           <KeyboardAwareScrollView centerContent={true} keyboardShouldPersistTaps={true} >

//             <Loader show={this.state.loading}/>
//             <AlertBox show={this.state.FormErrorFlag} text={this.state.FormError} isError={true} onPress={ () => this.setState({FormErrorFlag : false})}/>

//             <View style={Styles.headerView}>
//             <View style={Styles.signupLabelView}>
//               <Text style={Styles.signupLabel}>Signup</Text>
//             </View>
//             <View style={Styles.uploadView}>
//                 <TouchableOpacity onPress={this.openImagePicker} style={Styles.uploadTouchable} activeOpacity={0.2}>
//                   {avatarView}
//                 </TouchableOpacity>
//             </View>
//             </View>


//             <View style={[Styles.form, {width: Metrics.screenWidth}]}>

//               <View style={Styles.row}>
//                 <Hideo
//                   placeholder={I18n.t('name')}
//                   placeholderTextColor={Colors.snow}
//                   iconClass={Icon}
//                   iconName={'ios-person-outline'}
//                   iconColor={Colors.snow}
//                   iconBackgroundColor={'transparent'}
//                   ref='name'
//                   inputStyle={Styles.textInput}
//                   containerStyle={Styles.textStyle}
//                   keyboardType='default'
//                   returnKeyType='next'
//                   autoCapitalize='sentences'
//                   autoCorrect={false}
//                   onChangeText={this.handleChangeName}
//                   underlineColorAndroid='transparent'
//                   onSubmitEditing={() => this.refs.email.focus()}
//                 />

//               </View>
//               {/*<ErrorMessage show={!this.state.validForm} error={_.head(this.state.errors.name)}/>*/}
//               <Divider/>

//               <View style={Styles.row}>
//                 <Hideo
//                   placeholder={I18n.t('email')}
//                   placeholderTextColor={Colors.snow}
//                   iconClass={Icon}
//                   iconName={'ios-mail-outline'}
//                   iconColor={Colors.snow}
//                   iconBackgroundColor={'transparent'}
//                   ref='email'
//                   inputStyle={Styles.textInput}
//                   containerStyle={Styles.textStyle}
//                   keyboardType='email-address'
//                   returnKeyType='next'
//                   autoCapitalize='none'
//                   autoCorrect={false}
//                   onChangeText={this.handleChangeEmail}
//                   underlineColorAndroid='transparent'
//                   onSubmitEditing={() => this.refs.password.focus()}
//                 />

//               </View>
//               {/*<ErrorMessage show={!this.state.validForm} error={_.head(this.state.errors.email)}/>*/}
//               <Divider/>

//               <View style={Styles.row}>

//                 <Hideo
//                   placeholder={I18n.t('password')}
//                   placeholderTextColor={Colors.snow}
//                   iconClass={Icon}
//                   iconName={'ios-lock-outline'}
//                   iconColor={Colors.snow}
//                   iconBackgroundColor={'transparent'}
//                   ref='password'
//                   inputStyle={Styles.textInput}
//                   containerStyle={Styles.textStyle}
//                   keyboardType='default'
//                   returnKeyType='next'
//                   autoCapitalize='none'
//                   autoCorrect={false}
//                   onChangeText={this.handleChangePassword}
//                   underlineColorAndroid='transparent'
//                   secureTextEntry={true}
//                 />

//               </View>
//               {/*<ErrorMessage show={!this.state.validForm} error={_.head(this.state.errors.password)}/>*/}
//               <Divider/>

//               <DatePicker
//                 style={{width: Metrics.screenWidth}}
//                 mode="date"
//                 placeholder={this.state.displayDate}
//                 date={this.state.displayDate != 'Birthday' ? this.state.displayDate : null}
//                 format="MM/DD/YYYY"
//                 minDate="01/01/1800"
//                 maxDate={Moment().format('MM/DD/YYYY')}
//                 confirmBtnText="Confirm"
//                 cancelBtnText="Cancel"
//                 customStyles={{
//                   dateIcon: {
//                     position: 'absolute',
//                     left: Metrics.doubleBaseMargin,
//                     top: 3,
//                     marginLeft: 0
//                   },
//                   placeholderText: {
//                     color: Colors.snow,
//                     alignSelf: 'flex-start',
//                     marginLeft: (Metrics.doubleBaseMargin * 3) + 5
//                   },
//                   dateText: {
//                     color: Colors.snow,
//                     alignSelf: 'flex-start',
//                     marginLeft: (Metrics.doubleBaseMargin * 3) + 5
//                   }
//                 }}
//                 onDateChange={(date) => {dismissKeyboard(); this.setState({birthday: Moment(date, "MM/DD/YYYY").format('YYYY-MM-DD'), displayDate: date})}}
//               />
//               {/*<ErrorMessage show={!this.state.validForm} error={_.head(this.state.errors.birthday)}/>*/}
//               <Divider/>

//               <View style={Styles.row}>
//                 <TouchableOpacity onPress={this.onPressPicker} style={Styles.pickerTouchable}>
//                   <Icon name='ios-transgender-outline' style={Styles.pickerIcon}/>
//                   <Text style={Styles.pickerText} ref="genderText">{this.state.gender}</Text>
//                 </TouchableOpacity>

//               </View>
//               {/*<ErrorMessage show={!this.state.validForm} error={_.head(this.state.errors.gender)}/>*/}
//               <Divider/>

//               <View style={[Styles.row, {justifyContent: 'center', alignSelf: 'center', marginTop: Metrics.doubleBaseMargin}]}>
//                 <FullButton
//                   text='JOIN'
//                   onPress={this.handlePressSignup}
//                   style={Styles.button}
//                   textStyle={Styles.buttonText}
//                 />
//               </View>

//               <View style={[Styles.row, Styles.signupView]}>
//                 <View>
//                   <Text style={Styles.dontHaveAnAccount}>Already have an account?</Text>
//                 </View>
//                 <View>
//                   <TouchableOpacity onPress={NavigationActions.pop} style={Styles.signupTouchable} activeOpacity={0.2}>
//                     <Text style={Styles.signup}>Sign in</Text>
//                   </TouchableOpacity>
//                 </View>

//               </View>

//               <View style={[Styles.termsView]}>
//                 <View>
//                   <Text style={Styles.dontHaveAnAccount}>By Signing up, you are agreeing to the</Text>
//                 </View>
//                 <View>
//                   <TouchableOpacity onPress={() => this.setState({termsModal: true})} style={Styles.signupTouchable} activeOpacity={0.2}>
//                     <Text style={Styles.signup}>Terms & Conditions</Text>
//                   </TouchableOpacity>
//                   {this.renderTermsModal()}
//                 </View>

//               </View>

//             </View>


//           </KeyboardAwareScrollView>

//         </View>


//     )
//   }

// }

// const mapStateToProps = (state) => {
//   return {
//     fetching: state.login.fetching,
//     user: loggedInUser(state.login),
//     error: state.login.error
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//       attemptSignup: (name, email, birthday, gender, avatar, password) => dispatch(LoginActions.signupRequest(name, email, birthday, gender, avatar, password))
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
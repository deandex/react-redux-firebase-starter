import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FirebaseContext } from '../Firebase';

import { setAuthUserAction } from '../../actions/authUser';
import { setNonprofitAction, setCategoriesAction } from '../../actions/nonprofit';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      const fundraProfile = JSON.parse(localStorage.getItem('fundra-profile'));
      const { onSetAuthUser } = this.props;
      onSetAuthUser(fundraProfile);
    }

    componentDidMount() {
      const firebase = this.context;
      const { onSetAuthUser, onSetNonprofit, onSetCategories } = this.props;

      this.listener = firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem('fundra-profile', JSON.stringify(authUser));
          onSetAuthUser(authUser);

          firebase.nonprofitProvider.getDetail(authUser.agency.nid).then(snapshot => {
            const nonprofit = {
              key: snapshot.val().key,
              name: snapshot.val().name,
              street: snapshot.val().address,
              city: snapshot.val().city,
              countryState: snapshot.val().state,
              zipCode: snapshot.val().zipcode,
              ein: snapshot.val().federal,
              category: snapshot.val().category,
              type: snapshot.val().type,
              img: snapshot.val().img,
              email: snapshot.val().contact ? snapshot.val().contact.email : '',
              phone: snapshot.val().contact ? snapshot.val().contact.phone : '',
              website: snapshot.val().website,
              description: snapshot.val().description,
              subscribe: snapshot.val().subscribe || null,
              stripeAccount: snapshot.val().stripe_account || null,
            };

            onSetNonprofit(nonprofit);
          });

          firebase.nonprofitProvider.getCategoryOptions().then(result => {
            onSetCategories(result.categories);
          });
        },
        () => {
          localStorage.removeItem('fundra-profile');
          onSetAuthUser(null);
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...this.props} />;
    }
  }

  WithAuthentication.contextType = FirebaseContext;

  WithAuthentication.propTypes = {
    onSetAuthUser: PropTypes.func.isRequired,
    onSetNonprofit: PropTypes.func.isRequired,
    onSetCategories: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: authUser => dispatch(setAuthUserAction(authUser)),
    onSetNonprofit: nonprofit => dispatch(setNonprofitAction(nonprofit)),
    onSetCategories: categories => dispatch(setCategoriesAction(categories)),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
};

export default withAuthentication;

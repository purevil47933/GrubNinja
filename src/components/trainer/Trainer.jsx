import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import TrainerStatCards from './subcomponents/TrainerStatCards';
import PetSelect from './subcomponents/PetSelect';
import TrainingCard from './subcomponents/TrainingCard';
import PetSnacks from './subcomponents/PetSnacks';
import PropTypes from 'prop-types';
import { sendNotification, sendXPResult } from '../../util/notify';

// actions for testing
import { generateGameId } from '../../actions/generateGameId';
import { fetchPetRewards } from '../../actions/fetchRewards';
import { feedSnack } from '../../actions/feedSnack';

const Trainer = props => {
  // For testing
  const [activeSnackId, setActiveSnackId] = useState('');

  const handleChangeSnack = id => {
    console.log('handle change snack');
    setActiveSnackId(id);
  };

  const handleGameTest = async () => {
    try {
      await props.generateGameId();
      const gameExp = await props.fetchPetRewards();
      const feedExp = await props.feedSnack(activeSnackId);
      sendXPResult(parseInt(gameExp) + parseInt(feedExp) || gameExp);
    } catch (err) {
      sendNotification(err, 'danger');
      console.log(err);
    }
  };

  return (
    <Fragment>
      <h1>Pet Trainer</h1>
      <div className='row'>
        <div className='col-5'>
          <TrainerStatCards currentSnacks={props.snacks} />
          <PetSelect />
        </div>
        <div className='col'>
          <TrainingCard />
          <PetSnacks
            activeSnackId={activeSnackId}
            setActiveSnackId={handleChangeSnack}
            currentSnacks={props.snacks}
          />
          <div
            className='btn btn-block btn-primary feed-btn mt-4'
            onClick={handleGameTest}
          >
            Feed Pet
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Trainer.propTypes = {
  snacks: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  snacks: state.character.snacks
});

export default connect(
  mapStateToProps,
  { generateGameId, fetchPetRewards, feedSnack }
)(Trainer);

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StyledMainPage } from './MainPage.css';

import euroBanner from '../../../assets/images/euro-banner.png';
import Banner from '../../components/Banner/Banner';
import ImportantMatch from '../../components/Events/ImportantMatch';
import { getCouponFromStorage } from '../../store/actions';
import Loader from '../../shared/Spinner/Loader';
import { transformDate } from '../../utilities/transformDate';
import axiosConfig from '../../utilities/axiosConfig';
import EventCounterMobile from '../../components/Coupon/EventCounterMobile';
import DailyBonus from '../../components/User/DailyBonus';
import MatchMin from '../../components/Events/MatchMin';

import { IEventFrontend } from '@kkbets/api-interfaces';

function MainPage(): JSX.Element {
  const [importantMatches, setImportantMatches] = useState<IEventFrontend[]>(
    []
  );
  const [matches, setMatches] = useState<IEventFrontend[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axiosConfig.get<IEventFrontend[]>(
        '/events?ended=false&started=false'
      );
      const matches = res.data.filter((match) => !match.important);
      const ImportantMatches = res.data.filter((match) => match.important);

      setImportantMatches(ImportantMatches);
      setMatches(matches);
      setIsLoaded(true);
      dispatch(getCouponFromStorage());
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledMainPage>
      <EventCounterMobile />

      <DailyBonus></DailyBonus>

      <Banner image={euroBanner} />
      {!isLoaded && <Loader />}
      {isLoaded && importantMatches.length === 0 && matches.length === 0 && (
        <h3 style={{ marginTop: '50px' }}>
          There are no active events at the moment
        </h3>
      )}
      <div className="matches-container">
        {importantMatches.map(
          ({
            _id,
            date,
            teamAway,
            teamHome,
            category,
            courseAwayWin,
            courseDraw,
            courseHomeWin,
          }) => (
            <ImportantMatch
              key={_id}
              eventId={_id}
              league={category?.name}
              date={transformDate(date.toString())}
              teamAway={teamAway}
              teamHome={teamHome}
              courseAwayWin={courseAwayWin}
              courseDraw={courseDraw}
              courseHomeWin={courseHomeWin}
            />
          )
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        {matches.map(
          ({
            _id,
            date,
            teamAway,
            teamHome,
            category,
            courseAwayWin,
            courseDraw,
            courseHomeWin,
          }) => (
            <MatchMin
              key={_id}
              eventId={_id}
              league={category?.name}
              date={transformDate(date.toString())}
              teamAway={teamAway}
              teamHome={teamHome}
              courseAwayWin={courseAwayWin}
              courseDraw={courseDraw}
              courseHomeWin={courseHomeWin}
            />
          )
        )}
      </div>
    </StyledMainPage>
  );
}

export default MainPage;

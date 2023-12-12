import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

const MainHeader: FC = () => {
  const {t, i18n} = useTranslation();
  const lang = i18n.resolvedLanguage;
  const navigate = useNavigate();

  const handleLanguageClick = (language: string) => navigate(`?lang=${language}`);

  return <>
    <div className='personlalize-header personlalize-header-white  noprint'>
      <div className='navbar navbar-default navbar-fixed-top' role='navigation'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'/>
              <span className='icon-bar'/>
              <span className='icon-bar'/>
            </button>
            <div className='logo'>
              <a href='http://museuciencies.cat' title='Museu de Ciències Naturals de Barcelona'>
                <img src='https://www.bioexplora.cat/navigation/images/logo-nat2.png'
                  alt={t('institutionLegend.mcnb')}/>
              </a>
            </div>
            <a className='navbar-brand' href='https://www.bioexplora.cat/'>
              <span className='bio'>BIO</span>
              <span className='explora'>EXPLORA</span>
              <div className='slogan'>{t('slogan')}</div>
            </a>
            <div className='menu-languages'>
              <ul className='nav'>
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                    {lang.toUpperCase()}<b className='caret'/>
                  </a>
                  <ul className='dropdown-menu'>
                    <li><a onClick={() => handleLanguageClick('ca')} style={{cursor: 'pointer'}}>CA</a></li>
                    <li><a onClick={() => handleLanguageClick('es')} style={{cursor: 'pointer'}}>ES</a></li>
                    <li><a onClick={() => handleLanguageClick('en')} style={{cursor: 'pointer'}}>EN</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
              <li className='dropdown'>
                <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.collections.title')}`} className='dropdown-toggle'>
                  {t('navbar.collections.title')}
                  <b className='caret'/>
                </a>
                <ul className='dropdown-menu'>
                  <li>
                    <a href={`http://www.bioexplora.cat/OMNIMUS/?lang=${lang}`}>{t('navbar.collections.omnimus')}</a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.collections.open_collections_url')}`}>
                      {t('navbar.collections.open_collections')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.collections.taxo_map_url')}`}>
                      {t('navbar.collections.taxo_map')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/ncd/home/lang-${lang === 'es' ? 'es' : lang === 'ca' ? 'nl' : 'uk'}`}>{t('navbar.collections.guide_to_collections')}</a>
                  </li>
                </ul>
              </li>
              <li className='dropdown'>
                <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.projects.title')}`} className='dropdown-toggle'>
                  {t('navbar.projects.title')}
                  <b className='caret'/></a>
                <ul className='dropdown-menu'>
                  <li>
                    <a href={`http://www.bioexplora.cat/WIKICOLLECTA/index.php/${lang}/especimens-tipus`}>
                      {t('navbar.projects.type_specimens')}
                      <b className='caret'/>
                    </a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/WIKICOLLECTA/index.php/${lang}/protagonistes`}>
                      {t('navbar.projects.protagonists')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.projects.geocoding_url')}`}>
                      {t('navbar.projects.geocoding')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://www.bioexplora.cat/${lang}/${t('3d_atlas_url')}/`}>
                      {t('navbar.projects.3d_atlas')}
                    </a>
                  </li>
                </ul>
              </li>
              <li className='dropdown'>
                <a href='http://museucienciesjournals.cat/?lang=ca' className='dropdown-toggle'>
                  {t('navbar.scientific_journals.title')}
                  <b className='caret'/>
                </a>
                <ul className='dropdown-menu'>
                  <li>
                    <a href={`http://museucienciesjournals.cat/abc?lang=${lang}`}>
                      {t('navbar.scientific_journals.animal_biodiversity')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://museucienciesjournals.cat/amz?lang=${lang}`}>
                      {t('navbar.scientific_journals.archives')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://museucienciesjournals.cat/mmcn?lang=${lang}`}>
                      {t('navbar.scientific_journals.monographs')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://museucienciesjournals.cat/tmgb?lang=${lang}`}>
                      {t('navbar.scientific_journals.works')}
                    </a>
                  </li>
                  <li>
                    <a href={`http://museucienciesjournals.cat/other?lang=${lang}`}>
                      {t('navbar.scientific_journals.publications')}
                    </a>
                  </li>
                </ul>
              </li>
              <li className='dropdown'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                  {t('navbar.resources.title')}
                  <b className='caret'/>
                </a>
                <ul className='dropdown-menu'>
                  <li>
                    <a href={`http://www.bioexplora.cat/${lang}/${t('navbar.resources.panoramic_url')}`}>
                      {t('navbar.resources.panoramic')}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/*/.nav-collapse */}
        </div>
      </div>
      {/* HEADER */}
    </div>
  </>;
};

export default MainHeader;
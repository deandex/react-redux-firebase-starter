import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

function SEO({ description, lang, meta, keywords, title, image }) {
  const site = {
    siteMetadata: {
      title: process.env.REACT_APP_WEBSITE_TITLE,
      name: process.env.REACT_APP_WEBSITE_NAME,
      description: process.env.REACT_APP_WEBSITE_DESCRIPTION,
      author: `@deansofttechnology`,
      keywords: ['fundra', 'gofundra', 'fundraising', 'campaign'],
      image: process.env.REACT_APP_OPEN_GRAPH,
    },
  };

  const metaDescription = description || site.siteMetadata.description;
  const metaKeywords = [...site.siteMetadata.keywords, ...keywords];
  const metaImage = image || site.siteMetadata.image;

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s - ${site.siteMetadata.name} | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: `${title} - ${site.siteMetadata.name} | ${site.siteMetadata.title}`,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:site_name`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:url`,
          content: `${document.location.protocol}//${document.location.host}${document.location.pathname}`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          metaKeywords.length > 0
            ? {
                name: `keywords`,
                content: metaKeywords.join(`, `),
              }
            : [],
        )
        .concat(meta)}
      link={[
        {
          rel: `canonical`,
          href: `${document.location.protocol}//${document.location.host}${document.location.pathname}`,
        },
      ]}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  description: ``,
  image: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default SEO;

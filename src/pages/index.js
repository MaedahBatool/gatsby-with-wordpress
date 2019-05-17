import { graphql, Link } from 'gatsby';
import React, { Component } from 'react';
import Layout from '../layouts';
import { rhythm } from '../utils/typography';

class Home extends Component {
	render() {
		const data = this.props.data;

		return (
			<Layout>
				{data.allWordpressPost.edges.map(({ node }) => (
					<div css={{ marginBottom: rhythm(2) }} key={node.slug}>
						<Link to={node.slug} css={{ textDecoration: `none` }}>
							<h3 css={{ textDecoration: `none`, color: `#673399` }}>{node.title}</h3>
						</Link>
						<div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
					</div>
				))}
			</Layout>
		);
	}
}

export default Home;

// Set here the ID of the home page.
export const pageQuery = graphql`
	query {
		allWordpressPost {
			edges {
				node {
					title
					excerpt
					slug
				}
			}
		}
	}
`;

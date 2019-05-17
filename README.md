# Gatsby & WordPress Integration

![gatsby-with-wordpress](https://on.ahmda.ws/5e3eae/c)

<br>

Building static sites with `React.js` using **Gatsby** provides an **easy to deploy setup**, **blazing fast speed**, and **smooth developer experience**. JAMstack (JavaScript APIs Markup) is awesome and I am going to show you why it has become such a popular tool by demonstrating how you can leverage Gatsby to supercharge your next WordPress site.

First we are going to configure a basic Gatsby project setup. And then we'll use it to fetch data from our WordPress site.

## Integrating Gatsby.js with WordPress

 <details>
 <summary> <strong><code> Step #0</code></strong>: Don't have a Gatsby site setup? Read this. (CLICK TO EXPAND!) </summary>

In case you are an absolute beginner and this is your first time with Gatsby.js, all you need to do is follow these steps mentioned below. These will help you set up a basic Gatsby project.

- Install the Gatsby CLI by typing the following command in your terminal

```sh
npm install -g gatsby-cli
```

- Next, create a new Gatsby.js site through the following.

```sh
gatsby new site-name
```

- To access your site folder contents type the following.

```sh
cd site-name
```

- Finally, start the development server to begin building your Gatsby.js site.

```sh
gatsby develop
```

</details>

### 🔘 Step #1: Install `gatsby-source-wordpress` Plugin

If you have a WordPress site and you want to have its front-end built with Gatsby.js all you need to do is pull the existing data into your static Gatsby site. You can do that with the `gatsby-source-wordpress` plugin.

Inside your terminal type the following to install this plugin.

```sh
npm install gatsby-source-wordpress
```

### 🔘 Step #2: Configuring the plugin

Inside your `gatsby-config.js` file, add the configuration options which includes your WordPress site’s `baseUrl`, `protocol`, whether it’s hosted on wordpress.com or self-hosted i.e., `hostingWPCOM`, and whether it uses the Advanced Custom Fields (ACF) plugin or not `useACF` Also, we are going to mention all the `includedRoutes` which tells what data do we exactly want to fetch.

The configuration options inside your `gatsby-config.js` file looks like this:

```js
module.exports = {
  // ...
  plugins: [
    // ...
    {
    	resolve: `gatsby-source-wordpress`,
    	options: {
    		// Your WordPress source.
    		baseUrl: `demo.wp-api.org`,
    		protocol: `https`,
    		// Only fetches posts, tags and categories from the baseUrl.
    		includedRoutes: ['**/posts', '**/tags', '**/categories'],
    		// Not using ACF so putting it off.
    		useACF: false
    	}
    },
  ],
}
```

### 🔘 Step #3: Using the Fetched WordPress Data

Once your Gatsby site is fetching data from your WordPress source URL, it's time to create your site pages. This is done by implementing the `createPages` API in the `gatsby-node.js`.

This makes your fetched data available to be queried with GraphQL. At `build` time, the `gatsby-source-wordpress` plugin fetches your data, and use it to ”automatically infer a GraphQL schema” which you can query against.

Here's the code is of the `gatsby-node.js` file which iterates the WordPress post data.

```js
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);
const slash = require(`slash`);

/** Implement the Gatsby API “createPages”. This is
 * called after the Gatsby bootstrap is finished so you have
 * access to any information necessary to programmatically
 * create pages.
 * Will create pages for WordPress pages (route : /{slug})
 * Will create pages for WordPress posts (route : /post/{slug})
 */
exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions;

	/**
	 * The “graphql” function allows us to run arbitrary
	* queries against the local Gatsby GraphQL schema. Think of
	* it like the site has a built-in database constructed
	from the fetched data that you can run queries against.
	*/
	const result = await graphql(`
		{
			allWordpressPost {
				edges {
					node {
						id
						slug
						status
						template
						format
					}
				}
			}
		}
	`);

	// Check for any errors
	if (result.errors) {
		throw new Error(result.errors);
	}

	// Access query results via object destructuring
	const { allWordpressPost } = result.data;

	const postTemplate = path.resolve(`./src/templates/post.js`);
	/**
	 * We want to create a detailed page for each
	 * post node. We'll just use the WordPress Slug for the slug.
	 * The Post ID is prefixed with 'POST_'
	 */
	allWordpressPost.edges.forEach(edge => {
		createPage({
			path: `/${edge.node.slug}/`,
			component: slash(postTemplate),
			context: {
				id: edge.node.id
			}
		});
	});
};
```

### 🔘 Step #4: Create a `post.js` Template

Next, create a folder for templates and add files for posts, pages, layouts, etc. For now, I am creating a `post.js` file since I am fetching the posts from my WordPress site.

Here's the code:

``` js
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Layout from '../layouts';

class PostTemplate extends Component {
	render() {
		const post = this.props.data.wordpressPost;

		return (
			<Layout>
				<h1 dangerouslySetInnerHTML={{ __html: post.title }} />
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
			</Layout>
		);
	}
}

PostTemplate.propTypes = {
	data: PropTypes.object.isRequired,
	edges: PropTypes.array
};

export default PostTemplate;

export const pageQuery = graphql`
	query($id: String!) {
		wordpressPost(id: { eq: $id }) {
			title
			content
		}
	}
`;

```

### 🔘 Step #5: Final Result

To start the development server to view the final result type the following command.

```sh
npm start
```

You get the link from where you can access the site locally along with other details like no. of posts, categories and tags that are being fetched.

Here's a GIF for it:

![GIF](https://on.ahmda.ws/948668/c)

> 👋 **[Follow @MaedahBatool on Twitter](https://twitter.com/MaedahBatool/) →**

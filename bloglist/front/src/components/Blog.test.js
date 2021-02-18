/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

test('renders content and author and likes are hidden', () => {
    const blog = {
        title: 'title of test',
        author: 'test author',
        url: 'test.com',
        likes: 0
    }

    const component = render(
        <Blog blog={blog} />
    )

    // blog is rendered
    const divTitle = component.container.querySelector('.blog')
    expect(divTitle).toHaveTextContent('title of test')

    // rest body of the blog is hidden
    const divBlogContent = component.container.querySelector('.blogContent')
    console.log(prettyDOM(divBlogContent))
    expect(divBlogContent).toHaveStyle( 'display: none')
 })
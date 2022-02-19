import React, { useEffect, useState, useRef } from 'react'
import {
  useParams,
  history,
  useIntl,
  useLocation,
  Helmet,
  useSelector,
  useDispatch,
} from 'umi'
import ProjectList from '@/components/ProjectList'
import clsx from 'clsx'
import { Search, Close } from '@/components/Icons'
import { SHOT_LIST_PAGE_SIZE } from '@/constants'
import { ProjectModelState } from '@/models/project'

const SearchPage: React.FC = () => {
  const { query, type: searchType } = useParams<{
    query: string
    type: 'projects'
  }>()
  const intl = useIntl()
  const dispatch = useDispatch()
  const { count } = useSelector(({ project }: { project: ProjectModelState }) => project)

  const inputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const [searchValue, setSearchValue] = useState(query)

  useEffect(() => {
    setSearchValue(query)
  }, [location.pathname])

  useEffect(() => {
    dispatch({ type: 'project/clear' })
  }, [])

  const handleSearch = () => {
    history.push(
      `/search/${encodeURIComponent(searchType)}/${encodeURIComponent(
        searchValue ?? '',
      )}`,
    )
  }

  return (
    <div className="flex-grow w-full flex flex-col">
      <Helmet>
        {query && (
          <title>{`${query} - ${intl.formatMessage({
            id: 'site.name',
          })}`}</title>
        )}
        {!query && (
          <title>{`${intl.formatMessage({
            id: 'general.search',
          })} - ${intl.formatMessage({ id: 'site.name' })}`}</title>
        )}
      </Helmet>

      <div className="w-full py-8">
        <div className="w-full flex flex-row justify-center">
          <div className="w-full mx-4 lg:w-1/2 lg:mx-auto relative">
            <input
              ref={inputRef}
              className={clsx(
                'mx-auto w-full py-2 pl-6 pr-32 lg:pr-36',
                'text-gray-700 placeholder-gray-500 text-lg',
                'border-2 bg-white outline-none',
                'rounded-lg transition-all duration-200 ease-in-out',
                'focus:border-gray-500 focus:placeholder-transparent',
                'hover:border-gray-400',
              )}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder={intl.formatMessage({ id: `search.${searchType}` })}
            />

            <div
              className={clsx(
                'absolute right-0 top-0 h-full flex flex-row w-auto',
                'transition-all duration-200 ease-in-out',
              )}
            >
              <div
                className={clsx(
                  'w-8 mx-4 h-full',
                  'text-gray-300 hover:text-gray-500 cursor-pointer',
                )}
                onClick={() => {
                  setSearchValue('')
                  inputRef.current?.focus()
                }}
              >
                <Close />
              </div>

              <div
                className={clsx(
                  'w-20 lg:w-24 h-full btn-primary flex flex-col justify-center',
                  'py-3 px-6 lg:px-8 rounded-r-md',
                  'cursor-pointer font-medium transition-colors duration-200 focus:outline-none',
                )}
                onClick={() => {
                  handleSearch()
                }}
              >
                <Search />
              </div>
            </div>
          </div>
        </div>
       
      </div>
 
      {searchType === 'projects' && (
        <ProjectList
          loadMore={() => {
            dispatch({
              type: 'project/getProjects',
              payload: {
                skip: count,
                limit: SHOT_LIST_PAGE_SIZE,
                type: query === undefined ? 'all' : 'search',
                query: searchValue,
              },
            })
          }}
        />
      )}
 
    </div>
  )
}

export default SearchPage

import React, { ReactNode, useCallback, useEffect, useState } from "react"
import styled from "@emotion/styled"
import useEmblaCarousel from "embla-carousel-react"

import Icon from "./Icon"
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
} from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"

// const Embla = styled.div`
//   position: relative;
//   padding: 2rem;
//   background-color: ${({ theme }) => theme.colors.slider.bg};
//   border: 1px solid ${({ theme }) => theme.colors.slider.border};
//   border-radius: 0.3rem;
// `

// const EmblaViewport = styled.div`
//   overflow: hidden;
//   width: 100%;

//   .is-draggable {
//     cursor: move;
//     cursor: grab;
//   }

//   .is-dragging {
//     cursor: grabbing;
//   }
// `

// const EmblaContainer = styled.div`
//   display: flex;
// `

// export const EmblaSlide = styled.div`
//   position: relative;
//   min-width: 100%;

//   h2,
//   h3 {
//     margin-top: 0;
//   }
// `

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   margin-bottom: 1rem;
//   margin-left: 0;

//   @media (min-width: ${(props) => props.theme.breakpoints.s}) {
//     position: absolute;
//     bottom: 0;
//     left: 0;

//     justify-content: left;

//     margin-bottom: 2rem;
//     margin-left: 2rem;
//   }
// `

// const Button = styled.button`
//   background-color: ${({ theme, disabled }) =>
//     disabled ? theme.colors.slider.btnBgDisabled : theme.colors.slider.btnBg};
//   border: 0;
//   border-radius: 50%;
//   width: 35px;
//   height: 35px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-right: 0.8rem;
//   cursor: pointer;

//   &:last-child {
//     margin-right: 0;
//   }
// `

// const Dots = styled.div`
//   text-align: center;
// `

// const DotButton = styled.button<{ selected: boolean }>`
//   width: 5px;
//   height: 5px;
//   padding: 0;
//   border: 0;
//   border-radius: 50%;
//   background-color: ${({ theme, selected }) =>
//     selected ? theme.colors.slider.dotActive : theme.colors.slider.dot};
//   margin-right: 1rem;

//   &:last-child {
//     margin-right: 0;
//   }
// `

export interface IProps {
  children?: React.ReactNode
  onSlideChange?: (slideIndex: number) => void
}

const Slider: React.FC<IProps> = ({ children, onSlideChange }) => {
  const [emblaRef, embla] = useEmblaCarousel()
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<Array<number>>([])

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const scrollTo = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index)
      }

      if (onSlideChange) {
        onSlideChange(index)
      }
    },
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on("select", () => {
      const index = embla.selectedScrollSnap()
      if (onSlideChange) {
        onSlideChange(index)
      }
      onSelect()
    })
  }, [embla, setScrollSnaps, onSelect])

  // TODO: fix colors
  return (
    <Box
      position="relative"
      p="2rem"
      borderWidth="1px"
      borderBottomStyle="solid"
      borderRadius="0.3rem"
      w="full"
      bg="slider.bg"
    >
      <Box overflow="hidden" ref={emblaRef}>
        <Flex>{children}</Flex>
      </Box>
      <Flex
        position={{ sm: "absolute", base: "static" }}
        bottom={{ sm: 0 }}
        left={{ sm: 0 }}
        justifyContent={{ sm: "left", base: "center" }}
        mb={{ sm: "2rem", base: "1rem" }}
        ml={{ sm: "2rem", base: 0 }}
      >
        <IconButton
          aria-label="Left arrow"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          icon={<ChevronLeftIcon w={6} h={6} />}
          variant="unstyled"
          isRound
          mr="0.8rem"
          _hover={{ boxShadow: "none" }}
          _focus={{ boxShadow: "none" }}
          bg="slider.btnBg"
        />
        <IconButton
          aria-label="Right arrow"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          icon={<ChevronRightIcon w={6} h={6} />}
          variant="unstyled"
          isRound
          _hover={{ boxShadow: "none" }}
          _focus={{ boxShadow: "none" }}
          bg="slider.btnBg"
        />
      </Flex>
      <Center>
        {scrollSnaps.map((_, index) => (
          <Box
            key={index}
            backgroundColor={
              index === selectedIndex ? "slider.dotActive" : "slider.dot"
            }
            border={0}
            borderRadius="50%"
            width="5px"
            height="5px"
            padding={0}
            cursor="pointer"
            onClick={() => scrollTo(index)}
            sx={{
              marginRight: "1rem",
              "&:last-child": {
                marginRight: 0,
              },
            }}
          />
        ))}
      </Center>
    </Box>
  )
}

export const EmblaSlide: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      position="relative"
      minWidth="full"
      sx={{
        h2: {
          marginTop: 0,
        },
        h3: {
          marginTop: 0,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default Slider

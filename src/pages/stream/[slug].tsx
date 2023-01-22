import {
  Box,
  Button,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CreatePost } from "../../components/posts/create-post";
import { StreamPostList } from "../../components/posts/stream-list";
import {
  StreamProvider,
  useStream,
} from "../../components/streams/stream-provider";
import { StreamShell } from "../../components/streams/stream-shell";
import { Title } from "../../components/utils/title";
import type { CustomNextPage } from "../../types/next-page";
import { trpc } from "../../utils/api";
import { noop } from "../../utils/noop";

const StreamPage: CustomNextPage = () => {
  const subscribeToStream = trpc.stream.subscribe.useMutation();
  const router = useRouter();
  const stream = useStream();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (stream.permission) {
    return (
      <Box w="full">
        <Title title={stream.name} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CreatePost onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
        {stream.permission !== "MEMBER" && (
          <HStack m="2">
            <Button onClick={onOpen} mr="4">
              Create Post
            </Button>
            <Text>Invite:</Text>
            <Link href={window.location.href}>
              <Text textDecoration="underline" fontSize="lg">
                {window.location.href}
              </Text>
            </Link>
          </HStack>
        )}

        <StreamPostList />
      </Box>
    );
  }

  return (
    <Box>
      <Text>Subscribe to this stream to view the posts.</Text>

      <Button
        onClick={() => {
          subscribeToStream
            .mutateAsync({
              slug: stream.slug,
            })
            .then(() => {
              router.reload();
            })
            .catch(noop);
        }}
      >
        Subscribe
      </Button>
    </Box>
  );
};

StreamPage.auth = true;

StreamPage.getLayout = (page) => <StreamShell>{page}</StreamShell>;

export default StreamPage;
